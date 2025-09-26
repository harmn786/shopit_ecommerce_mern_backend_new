import express from 'express'
import { createProductReview, deleteProduct, deleteProductReview, getAllProducts,getProductDetails,getProductReviews,newProduct, updateProduct ,canUserReview, getAdminProducts, uploadProductImages, deleteProductImages} from '../controllers/productController.js'
import { isAuthenticatedUser,authorizeRoles } from '../middlewares/auth.js'
const router = express.Router()

router.route('/products').get(getAllProducts)
router.route('/admin/products').post(isAuthenticatedUser,authorizeRoles("admin"),newProduct)
router.route('/admin/products').get(isAuthenticatedUser,authorizeRoles("admin"),getAdminProducts)
router.route('/admin/products/:id/upload_images').put(isAuthenticatedUser,authorizeRoles("admin"),uploadProductImages)
router.route('/admin/products/:id/delete_images').put(isAuthenticatedUser,authorizeRoles("admin"),deleteProductImages)
router.route('/products/:id').get(getProductDetails)
router.route('/admin/products/:id').put(isAuthenticatedUser,authorizeRoles("admin"),updateProduct)
router.route('/admin/products/:id').delete(isAuthenticatedUser,authorizeRoles("admin"),deleteProduct)
router.route('/reviews').get(isAuthenticatedUser,getProductReviews)
router.route('/reviews').put(isAuthenticatedUser,createProductReview)
router.route('/admin/reviews').delete(isAuthenticatedUser,authorizeRoles("admin"),deleteProductReview)
router.route('/can_review').get(isAuthenticatedUser,canUserReview)

export default router