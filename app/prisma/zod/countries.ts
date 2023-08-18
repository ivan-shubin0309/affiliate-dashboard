import * as z from "zod"
import * as imports from "../zod-add-schema"
import { Completetraffic, RelatedtrafficModel } from "./index"

export const countriesModel = z.object({
  id: z.number().int(),
  title: z.string(),
  valid: z.boolean(),
  code: z.string(),
  spotCode: z.number().int(),
})

export interface Completecountries extends z.infer<typeof countriesModel> {
  traffic: Completetraffic[]
}

/**
 * RelatedcountriesModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const RelatedcountriesModel: z.ZodSchema<Completecountries> = z.lazy(() => countriesModel.extend({
  traffic: RelatedtrafficModel.array(),
}))
