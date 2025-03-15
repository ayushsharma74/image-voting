import {v2 as cloudinary} from 'cloudinary'

export async function createImageUpload() {
  const timestamp = new Date().getTime()
  const signature = await cloudinary.utils.api_sign_request(
    {
      timestamp,
    },
    "bqWfv0IO24aqAQE9RlgU4cGb7nI"
    // process.env.CLOUDINARY_SECRET!
  )
  return { timestamp, signature }
}