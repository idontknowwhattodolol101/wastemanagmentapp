import json
import boto3
import urllib.parse
from datetime import datetime

# Initialize clients
rekognition = boto3.client('rekognition', region_name='eu-west-2')
dynamodb = boto3.resource('dynamodb', region_name='eu-west-2')
table = dynamodb.Table('wastedata')  # Replace with your DynamoDB table name

# Define recyclable materials
recyclable_materials = {
    'Plastic',
    'Paper',
    'Glass',
    'Metal',
    'Cardboard',
    'Aluminum',
    'Steel'
}

def analyze_waste_image(bucket, key):
    response = rekognition.detect_labels(
        Image={
            'S3Object': {
                'Bucket': bucket,
                'Name': key
            }
        },
        MaxLabels=10,
        MinConfidence=75
    )
    
    # Initialize lists to store detected materials and everyday objects
    detected_materials = []
    detected_objects = []
    
    for label in response['Labels']:
        if 'Materials' in [category['Name'] for category in label['Categories']]:
            detected_materials.append(label['Name'])
        if 'Everyday Objects' in [category['Name'] for category in label['Categories']]:
            detected_objects.append(label['Name'])

    # Determine recyclability
    is_recyclable = any(material in detected_materials for material in recyclable_materials)
    
    # Create output summary
    output_summary = {
        "Detected Materials": list(set(detected_materials)),
        "Detected Everyday Objects": list(set(detected_objects)),
        "Recyclability Statement": f"Yes, this item is recyclable." if is_recyclable else "No, this item is not recyclable."
    }

    return output_summary

def save_to_dynamodb(image_key, analysis_result):
    # Prepare the item to be saved to DynamoDB
    item = {
        'imageKey': image_key,  # Use imageKey as the partition key
        'Detected Everyday Object': analysis_result['Detected Everyday Objects'][0] if analysis_result['Detected Everyday Objects'] else 'Unknown',
        'Detected Material': analysis_result['Detected Materials'][0] if analysis_result['Detected Materials'] else 'Unknown',
        'Recyclability Statement': analysis_result['Recyclability Statement'],
        'timestamp': datetime.utcnow().isoformat()  # Store the timestamp of the analysis
    }
    
    # Save the item to DynamoDB
    table.put_item(Item=item)

def lambda_handler(event, context):
    print("Received event:", json.dumps(event))
    
    try:
        # Check if the event is triggered by API Gateway
        if 'body' in event and event['body']:
            body = json.loads(event['body'])  # Load the JSON body from the request
            print("Parsed body:", body)
            
            if 'fileName' not in body:
                raise ValueError("Missing 'fileName' in request body")
            
            bucket = 'wastepictures202468ae6-main'  # Your S3 bucket name
            key = body['fileName']  # Extract the fileName from the body
        else:
            # If the event is triggered by S3
            bucket = event['Records'][0]['s3']['bucket']['name']
            key = urllib.parse.unquote_plus(event['Records'][0]['s3']['object']['key'])

        # Analyze the image
        analysis_result = analyze_waste_image(bucket, key)
        
        # Save the result to DynamoDB
        save_to_dynamodb(key, analysis_result)
        
        # Log the final summary
        print(json.dumps(analysis_result, indent=4))  # Log final output
        
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Headers': '*',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'OPTIONS,POST,GET'
            },
            'body': json.dumps(analysis_result)
        }
        
    except Exception as e:
        print(f"Error processing image: {e}")
        return {
            'statusCode': 500,
            'headers': {
                'Access-Control-Allow-Headers': '*',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'OPTIONS,POST,GET'
            },
            'body': json.dumps({"error": str(e)})
        }
