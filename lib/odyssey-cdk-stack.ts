import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { OdysseyStackProps } from './common';
import * as ec2 from 'aws-cdk-lib/aws-ec2' // import ec2 library 
import * as iam from 'aws-cdk-lib/aws-iam' // import ec2 library 
import { CfnKeyPair } from 'aws-cdk-lib/aws-ec2';

export class OdysseyCdkStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: OdysseyStackProps) {
    super(scope, id, props);

    // Default VPC
    const defaultVpc = ec2.Vpc.fromLookup(this, 'VPC', { isDefault: true })

    // Gating instance with a role
    const role = new iam.Role(
      this,
      'odyssey-1-role', // this is a unique id that will represent this resource in a Cloudformation template
      { assumedBy: new iam.ServicePrincipal('ec2.amazonaws.com') }
    )

    // Security group for firewall
    // This will determine open and closed ports
    const securityGroup = new ec2.SecurityGroup(
      this,
      'odyssey-1-sg',
      {
        vpc: defaultVpc,
        allowAllOutbound: true, // will let your instance send outboud traffic
        securityGroupName: 'odyssey-1-sg',
      }
    )

    // Open port 22 for ssh
    securityGroup.addIngressRule(
      ec2.Peer.anyIpv4(),
      ec2.Port.tcp(22),
      'Allows SSH access from Internet'
    )

    // Open port 80 for http
    securityGroup.addIngressRule(
      ec2.Peer.anyIpv4(),
      ec2.Port.tcp(80),
      'Allows HTTP access from Internet'
    )
    
    // Open port 443 for https
    securityGroup.addIngressRule(
      ec2.Peer.anyIpv4(),
      ec2.Port.tcp(443),
      'Allows HTTPS access from Internet'
    )
    
    // Create keypair
    const keyPair = new ec2.CfnKeyPair(this, 'odyssey-1-key', {
      keyName: 'odyssey-1-key'
    })

    // Finally lets provision our ec2 instance
    const instance = new ec2.Instance(this, 'odyssey-1', {
      vpc: defaultVpc,
      role: role,
      securityGroup: securityGroup,
      instanceName: 'odyssey-1',
      instanceType: ec2.InstanceType.of( // t2.micro has free tier usage in aws
        ec2.InstanceClass.T2,
        ec2.InstanceSize.MICRO
      ),
      machineImage: ec2.MachineImage.latestAmazonLinux({
        generation: ec2.AmazonLinuxGeneration.AMAZON_LINUX_2,
      }),

      keyName: keyPair.keyName, // we will create this in the console before we deploy
    })

    new cdk.CfnOutput(this, 'odyssey-1-output', {
      value: instance.instancePublicIp
    })
  }
}
