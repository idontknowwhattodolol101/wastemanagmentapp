import { AmplifyApiRestResourceStackTemplate, AmplifyProjectInfo } from '@aws-amplify/cli-extensibility-helper';

export function override(resources: AmplifyApiRestResourceStackTemplate, amplifyProjectInfo: AmplifyProjectInfo) {
  resources.addCfnResource(
    {
      type: "AWS::Lambda::Permission",
      properties: {
        Action: "lambda:InvokeFunction",
        FunctionName: { "Ref": "wastemanagmentfunctionyoutube2" },
        Principal: "apigateway.amazonaws.com",
        SourceArn: {
          "Fn::Join": [
            "",
            [
              "arn:aws:execute-api:",
              { "Ref": "AWS::Region" },
              ":",
              { "Ref": "AWS::AccountId" },
              ":",
              { "Ref": "wastemanagementapiyoutube" },
              "/*/*"
            ]
          ]
        }
      }
    },
    "LambdaAuthorizerResourceBasedPolicy"
  );
}
