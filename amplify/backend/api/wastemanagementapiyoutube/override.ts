// This file is used to override the REST API resources configuration
import { AmplifyApiRestResourceStackTemplate, AmplifyProjectInfo } from '@aws-amplify/cli-extensibility-helper';

export function override(resources: AmplifyApiRestResourceStackTemplate, amplifyProjectInfo: AmplifyProjectInfo) {

// Adding Resource Based policy to Lambda authorizer function
resources.addCfnResource(
  {
    type: "AWS::Lambda::Permission",
    properties: {
      Action: "lambda:InvokeFunction",
      FunctionName: {"Ref": "<wastemanagmentfunctionyoutube2-main>"},
      Principal: "apigateway.amazonaws.com",
      SourceArn:{
        "Fn::Join": [
          "",
          [
            "arn:aws:execute-api:",
            {
              "Ref": "eu-west-2"
            },
            ":",
            {
              "Ref": "084375567719"
            },
            ":",
            {
              "Ref": "<wastemanagmentapiyoutube> "
            },
            "/*/*"
            ]
          ]
        }
      }
    },
    "LambdaAuthorizerResourceBasedPolicy"
);

}