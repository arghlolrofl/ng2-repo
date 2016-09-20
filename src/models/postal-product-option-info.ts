import PostalProductOptionDetail from './postal-product-option-detail';

/**
 * PostalProductOptionInfo model.
 */
export default class PostalProductOptionInfo {

    Code: string;

    Name: string;

    Price: number;

    Amount: number;

    Details: PostalProductOptionDetail;
}