import { Router } from "express"

/**
 * Controller interface contains generic properties for controllers
 */
interface Controller {
    path: string
    router: Router
}

export default Controller
