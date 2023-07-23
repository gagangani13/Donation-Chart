import {Router} from "express";
import { addAmount, donations, download } from "./controller";
const router=Router();
router.get('/donations',donations)
router.post('/addAmount',addAmount);
router.get('/download',download)
export default router;