export const Product: (data?: {
    id?: string;
    name?: string;
    description?: string;
    price?: number;
    stock?: number;
    category?: string;
}) => {
    id: string;
    name: string;
    description: string;
    price: number;
    stock: number;
    category: string;
};
export function GetAllProducts(): Promise<Array<{
    id: string;
    name: string;
    description: string;
    price: number;
    stock: number;
    category: string;
}>>;
export function GetProductById(productId: string): Promise<{
    id: string;
    name: string;
    description: string;
    price: number;
    stock: number;
    category: string;
} | null>;
export function AddProduct(productDetails: {
    id?: string;
    name?: string;
    description?: string;
    price?: number;
    stock?: number;
    category?: string;
}): Promise<{
    id: string;
    name: string;
    description: string;
    price: number;
    stock: number;
    category: string;
}>;
export function UpdateProduct(productDetails: {
    id: string;
    name?: string;
    description?: string;
    price?: number;
    stock?: number;
    category?: string;
}): Promise<{
    id: string;
    name: string;
    description: string;
    price: number;
    stock: number;
    category: string;
}>;
export function DeleteProduct(productId: string): Promise<boolean>;
export default function ProductManagementPage(): React.Element;