import { Router } from "express";
import { 
  addRequest, 
  allTickets, 
  allTicketsWithPage, 
  aomTIcketApproval, 
  aomTickets, 
  aomTicketsWithPage, 
  deleteFraud, 
  findUserTickets, 
  maxPagesSearch, 
  reports, 
  search, 
  ticketDeclined, 
  updateFraud, 
  updateIsComplete, 
  updateLastApproval, 
  updateOos, 
  updateOosComment, 
  updatePurchasingNewItem, 
  updatePurchasingOos, 
  updatePurchasingUsedItem, 
  updateSemiApproval, 
  updateTicketOpen, 
  updateVerify, 
  userDeleteTicket, 
  userTicketReattempt, 
  userTickets, 
  userTicketUpdate 
} from "../controllers/ticketController.js";
import { auth } from "../../../middleware/auth.js";
import { validateTicketRequest } from "../../../middleware/modelValidation.js";
const router = Router()
// tickets
// validateTicketRequest
router.get("/user-tickets/:userId/:page", findUserTickets);
router.get("/user-tickets/:id", userTickets);
router.get("/aom-tickets/:id", aomTickets)
router.get("/aom-tickets/:userId/:page", aomTicketsWithPage)
router.get("/all-tickets", allTickets)
router.get('/all-tickets/:page', allTicketsWithPage)
router.get('/ticket-search/:userId/:page', search)
router.get('/ticket-maxpage-search/:id', maxPagesSearch)
router.get('/ticket-report/:page', reports)

router.put('/ticket-purchasing-oos/:id', updatePurchasingOos)
router.put('/ticket-purchasing-new-item/:id', updatePurchasingNewItem)
router.put('/ticket-purchasing-used-item/:id', updatePurchasingUsedItem)

router.put("/ticket-declined/:id", ticketDeclined)
router.post("/new_request/:id", validateTicketRequest, addRequest);
router.put("/user-ticket-reattempt/:id", userTicketReattempt)
router.put('/ticket-verified/:id', updateVerify)
router.put("/aom-ticket-approval/:id", aomTIcketApproval)
router.put('/ticket-last-approval/:id', updateLastApproval)
router.put('/ticket-completed/:id', updateIsComplete)
router.put('/ticket-open/:id/:userId', updateTicketOpen);
router.put('/user-ticket-update/:id', userTicketUpdate)
router.delete("/user-ticket-delete/:id", userDeleteTicket)
router.put("/ticket-oos/:id", updateOos)
router.put('/ticket-oos-comment/:id', updateOosComment)
router.put("/ticket-fraud/:id", updateFraud)
router.delete("/ticket-fraud-delete/:id", deleteFraud)
router.put('/ticket-semi-approval/:id', updateSemiApproval)





export {router as TicketRoutes}