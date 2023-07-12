import { IAMClient, GetUserCommand,CreateUserCommand ,
  CreateAccessKeyCommand, AttachGroupPolicyCommand, DetachGroupPolicyCommand} from '@aws-sdk/client-iam';

const accessKeyId = "AKIA5SFSGTHHY56JRHWV";
const secretAccessKey = "knOSZ3ldNK/5a9e8/nsaZTmgBM9Cqtk7DXnZu78B";
const region = "us-east-1"; // Replace with your desired AWS region

const iamClient = new IAMClient({
  region,
  credentials: {
    accessKeyId,
    secretAccessKey,
  },
});


export const checkUserExists = async (userName) => {
  const params = {
    UserName: userName,
  };

  try {
    await iamClient.send(new GetUserCommand(params));
    return true; // User exists
  } catch (err) {
    return false; // User does not exist
  }
};

export const createUser = async (userName) => {
  const params = {
    UserName: userName,
  };

  try {
    const result = await iamClient.send(new CreateUserCommand(params));
    return result; // Return the created user details
  } catch (err) {
    console.log('Error creating user:', err);
    throw new Error('Failed to create user!!!');
  }
};

export const createAccessKey = async (userName) => {
  const params = {
    UserName: userName,
  };

  try {
    const data = await iamClient.send(new CreateAccessKeyCommand(params));
    console.log('Access key created', data);
    return data; // Return the created access key details
  } catch (err) {
    console.log(err);
    throw new Error('Failed to create access key!!!');
  }
};

export const attachGroupPolicy = async (groupName, policyArn) => {
  const params = {
    PolicyArn: policyArn,
    GroupName: groupName,
  };

  try {
    const data = await iamClient.send(new AttachGroupPolicyCommand(params));
    console.log(`Attached the policy ${policyArn} to user ${groupName}`, data);
  } catch (err) {
    console.log(err);
  }
};

export const detachGroupPolicy = async (groupName, policyArn) => {
  const params = {
    PolicyArn: policyArn,
    GroupName: groupName,
  };

  try {
    const data = await iamClient.send(new DetachGroupPolicyCommand(params));
    console.log(`Attached the policy ${policyArn} to user ${groupName}`, data);
  } catch (err) {
    console.log(err);
  }
};
