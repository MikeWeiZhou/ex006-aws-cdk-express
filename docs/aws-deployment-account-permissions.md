# AWS Deployment Acount Permissions
AWS permissions required for a successful deployment. More permissions are granted than necessary. **Production accounts should have more fine-grained permissions.**

- AmazonRDSFullAccess
- AmazonEC2FullAccess
- SecretsManagerReadWrite
- IAMFullAccess
- AmazonS3FullAccess
- AmazonECS_FullAccess
- AWSCloudFormationFullAccess
- AWSLambda_FullAccess
- *custom policy for ECR: (replace account id)*
```
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "ecr:BatchGetImage",
        "ecr:BatchCheckLayerAvailability",
        "ecr:CompleteLayerUpload",
        "ecr:DescribeImages",
        "ecr:DescribeRepositories",
        "ecr:GetDownloadUrlForLayer",
        "ecr:InitiateLayerUpload",
        "ecr:ListImages",
        "ecr:PutImage",
        "ecr:UploadLayerPart",
        "ecr:GetRepositoryPolicy",
        "ecr:SetRepositoryPolicy",
        "ecr:CreateRepository",
        "ecr:PutImageScanningConfiguration"
      ],
      "Resource": [
        "arn:aws:ecr:us-west-2:12346784054:repository/aws-cdk/assets",
        "arn:aws:ecr:us-west-1:12346784054:repository/aws-cdk/assets"
      ]
    },
    {
      "Effect": "Allow",
      "Action": "ecr:GetAuthorizationToken",
      "Resource": "*"
    }
  ]
}
```