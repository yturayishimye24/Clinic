
import admin from "firebase-admin"

admin.initializeApp({
  crediential: admin.credential.applicationDefault()
})

export default admin;