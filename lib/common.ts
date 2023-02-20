import { StackProps } from "aws-cdk-lib";

export interface OdysseyStackProps extends StackProps{
  env: {
    account: string
    region: string
  }
  ec2InstanceName: string
}