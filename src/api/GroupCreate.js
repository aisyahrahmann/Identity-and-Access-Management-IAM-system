import { IAMClient, CreateGroupCommand } from '@aws-sdk/client-iam';


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


export const createGroup = async (groupName) => {
    const params = {
     GroupName: groupName,
    };
  
    try {
      const result = await iamClient.send(new CreateGroupCommand(params));
      return result; // Return the created group details
    } catch (err) {
      console.log('Error creating group:', err);
      throw new Error('Failed to create group!!!');
    }
  };