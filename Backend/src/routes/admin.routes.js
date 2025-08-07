import { Router } from 'express';

import {
    getUsers,
    getFacilities,
    getFacilitiesByName,
    getUsersByName,
} from "../controllers/admin.controller.js";

import verifyJWT from "../middlewares/auth.middleware.js";
import isAdmin from "../middlewares/isAdmin.middleware.js";

const router = Router();

router.route('/users').get(verifyJWT, isAdmin, getUsers);
router.route('/facilities').get(verifyJWT, isAdmin, getFacilities);
router.route('/usersByName').get(verifyJWT, isAdmin, getUsersByName);
router.route('/facilitiesByName').get(verifyJWT, isAdmin, getFacilitiesByName);

export default router;