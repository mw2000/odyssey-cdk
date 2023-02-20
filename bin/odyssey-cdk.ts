#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { OdysseyCdkStack } from '../lib/odyssey-cdk-stack';

import * as dotenv from 'dotenv';

dotenv.config()

const env = process.env.ENVIRONMENT || 'prod'
const app = new cdk.App();
const stack = new OdysseyCdkStack(app, 'OdysseyCdkStack', {
  env: {
    account: process.env.AWS_ACCOUNT || '',
    region: process.env.AWS_REGION || '',
  },
  ec2InstanceName: process.env.EC2_INSTANCE_NAME || ''
});

cdk.Tags.of(stack).add('project', 'odyssey');
cdk.Tags.of(stack).add('project-sku', 'no-sku');
cdk.Tags.of(stack).add('env', env) ;
cdk.Tags.of(stack).add('auto-generated', 'true');
cdk.Tags.of(stack).add('auto-generated-tool', 'aws-cdk')