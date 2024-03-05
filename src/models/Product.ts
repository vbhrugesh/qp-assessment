import { PrismaClient } from "@prisma/client";
import { IProduct } from "../interfaces/IProduct";

class ProductModel {
	prisma: PrismaClient;
	constructor() {
		this.prisma = new PrismaClient();
	}

	async createProduct(data: IProduct) {
		try {
			const product = await this.prisma.product.create({
				data: {
					...data,
				},
			});
			return product;
		} catch (error) {
			let errorMsg = `Something went wrong when creating product ${name}`;
			if (error instanceof Error) {
				errorMsg = error.message;
			}
			throw new Error(errorMsg);
		}
	}

	async updateProduct(productId: string, data: Partial<IProduct>) {
		try {
			const product = await this.prisma.product.update({
				where: {
					id: productId,
				},
				data: {
					...data,
				},
			});
			return product;
		} catch (error) {
			let errorMsg = `Something went wrong when creating product ${name}`;
			if (error instanceof Error) {
				errorMsg = error.message;
			}
			throw new Error(errorMsg);
		}
	}

	async getAll() {
		try {
			const products = await this.prisma.product.findMany();
			return products;
		} catch (error) {
			let errorMsg = `Something went wrong when getting all products`;
			if (error instanceof Error) {
				errorMsg = error.message;
			}
			throw new Error(errorMsg);
		}
	}

	async deleteProductgory(productId: string) {
		try {
			const product = await this.prisma.product.delete({
				where: {
					id: productId,
				},
			});
			return product;
		} catch (error) {
			let errorMsg = `Something went wrong when deleting product`;
			if (error instanceof Error) {
				errorMsg = error.message;
			}
			throw new Error(errorMsg);
		}
	}
}

export default ProductModel;