import json
import boto3

dynamodb = boto3.resource('dynamodb')
table = dynamodb.Table('WasteData')  # Replace with your actual DynamoDB table name

def lambda_handler(event, context):
    try:
        # Check if 'fileName' is provided in query parameters
        if 'queryStringParameters' not in event or 'fileName' not in event['queryStringParameters']:
            raise ValueError("Missing 'fileName' in query parameters")
        
        # Extract the 'fileName' parameter
        file_name = event['queryStringParameters']['fileName']
        
        # Query DynamoDB based on the 'fileName'
        response = table.get_item(Key={'imageKey': file_name})
        if 'Item' not in response:
            return {'statusCode': 404, 'body': json.dumps({"error": "Analysis result not found"})}
        
        # Return the retrieved item
        analysis_result = response['Item']
        
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET'
            },
            'body': json.dumps(analysis_result)
        }
        
    except Exception as e:
        return {'statusCode': 500, 'body': json.dumps({"error": str(e)})}
