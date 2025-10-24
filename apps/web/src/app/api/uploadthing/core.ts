import { createUploadthing, type FileRouter } from 'uploadthing/next';

const f = createUploadthing();

/**
 * File router configuration for UploadThing
 * Defines upload endpoints with size/count limits and callbacks
 */
export const ourFileRouter = {
  imageUploader: f({
    image: {
      maxFileSize: '4MB', // Prevents large uncompressed images
      maxFileCount: 5, // Allow multiple photos per diary entry
    },
  })
    .middleware(async () => {
      // Add authentication here when user system is implemented:
      // const user = await auth();
      // if (!user) throw new UploadThingError("Unauthorized");

      return { uploadedBy: 'anonymous' };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      // Server-side callback after successful upload
      console.log('Upload complete for userId:', metadata.uploadedBy);
      console.log('File uploaded:', file.name);

      return { uploadedBy: metadata.uploadedBy };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
