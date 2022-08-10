import Evaporate from "evaporate";
import AWS from "aws-sdk";
import config from 'src/store/config';

const { store } = config;

export const getEvaporateClient = async () => {
  const bucket = process.env.REACT_APP_AWS_BUCKET || 'ediflo-develop';
  return await Evaporate.create({
    aws_key: process.env.REACT_APP_AWS_KEY,
    bucket,
    awsRegion: process.env.REACT_APP_AWS_REGION,
    signerUrl: `${process.env.REACT_APP_API_URL}/api/signer`,
    signHeaders: {
      Authorization: `Bearer ${store.getState().authReducer.token}`
    },
    aws_url: `https://${bucket}.s3.${process.env.REACT_APP_AWS_REGION}.amazonaws.com`,
    cloudfront: true,
    logging: false,
    awsSignatureVersion: '4',
    computeContentMd5: true,
    cryptoMd5Method: function (data) {
      return AWS.util.crypto.md5(data, 'base64');
    },
    cryptoHexEncodedHash256: function (data) {
      return AWS.util.crypto.sha256(data, 'hex');
    },
  })
}