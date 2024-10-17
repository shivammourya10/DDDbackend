// controllers/callController.js
import Agora from 'agora-access-token'; // Import Agora token SDK

const generateAgoraToken = (req, res) => {
  const { channelName, uid } = req.body;

  if (!channelName || !uid) {
    return res.status(400).json({ message: 'channelName and uid are required' });
  }

  const appID = process.env.AGORA_APP_ID;  // Your Agora App ID
  const appCertificate = process.env.AGORA_APP_CERTIFICATE;  // Your Agora App Certificate
  const expirationTimeInSeconds = 3600;  // Token expiration time (1 hour)
  const role = Agora.RtcRole.PUBLISHER;  // Publisher (user who initiates the call)

  const currentTimestamp = Math.floor(Date.now() / 1000);
  const privilegeExpiredTs = currentTimestamp + expirationTimeInSeconds;

  // Generate the token
  const token = Agora.RtcTokenBuilder.buildTokenWithUid(
    appID,
    appCertificate,
    channelName,
    uid,
    role,
    privilegeExpiredTs
  );
  // Send token back to the frontend
  res.json({
    token,
    privilegeExpiredTs,
  });
};
export default generateAgoraToken;