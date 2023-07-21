import {Router} from "express";
import { addAmount, donations } from "./controller";
const router=Router();
router.get('/donations',donations)
router.post('/addAmount',addAmount);
export default router;