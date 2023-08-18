import * as z from "zod"
import * as imports from "../zod-add-schema"
import { permissionprofile_defaultViewForDealType } from "@prisma/client"
import { Completeaffiliates, RelatedaffiliatesModel } from "./index"

export const permissionProfileModel = z.object({
  id: z.number().int(),
  defaultViewForDealType: z.nativeEnum(permissionprofile_defaultViewForDealType),
  name: z.string(),
  rdate: z.date(),
  affiliate_id: z.number().int(),
  reportsPermissions: z.string(),
  fieldsPermissions: z.string(),
  valid: z.boolean(),
  created_by_admin_id: z.number().int(),
})

export interface CompletepermissionProfile extends z.infer<typeof permissionProfileModel> {
  affiliates: Completeaffiliates[]
}

/**
 * RelatedpermissionProfileModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const RelatedpermissionProfileModel: z.ZodSchema<CompletepermissionProfile> = z.lazy(() => permissionProfileModel.extend({
  affiliates: RelatedaffiliatesModel.array(),
}))
