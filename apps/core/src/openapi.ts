import type { OpenAPIGeneratorGenerateOptions } from "@orpc/openapi"
import { OpenAPIGenerator } from "@orpc/openapi"
import { ZodToJsonSchemaConverter } from "@orpc/zod"
import {
	CreateUserInputSchema,
	contract,
	ListUsersInputSchema,
	UserByIdInputSchema,
	UserSchema,
} from "@repo/api-contract"

export const openApiSchemaConverters = [new ZodToJsonSchemaConverter()]

export const openApiSpecOptions = {
	commonSchemas: {
		CreateUserInput: { schema: CreateUserInputSchema },
		ListUsersInput: { schema: ListUsersInputSchema },
		User: { schema: UserSchema },
		UserByIdInput: { schema: UserByIdInputSchema },
	},
	components: {
		securitySchemes: {
			bearerAuth: {
				scheme: "bearer",
				type: "http",
			},
		},
	},
	info: {
		title: "Onboarder Core API",
		version: "0.1.0",
	},
	security: [{ bearerAuth: [] }],
	servers: [{ url: "/api" }],
} satisfies OpenAPIGeneratorGenerateOptions

const generator = new OpenAPIGenerator({
	schemaConverters: openApiSchemaConverters,
})

let document: ReturnType<typeof generator.generate> | undefined

export function createOpenApiDocument() {
	document ??= generator.generate(contract, openApiSpecOptions)
	return document
}
