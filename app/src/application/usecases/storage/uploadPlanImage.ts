import { uploadPlanImage as upload } from '../../../infrastructure/supabase/storage/PlanImagesStorage';

export async function uploadPlanImage(planId: string, imageUri: string) {
  return upload(planId, imageUri);
}
