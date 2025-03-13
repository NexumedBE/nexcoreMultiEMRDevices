import express from 'express';

const router = express.Router();
let listenersActive = false;

export const setListenersActive = (status: boolean) => {
  listenersActive = status;
};


router.get('/check-listeners', (req, res) => {
  res.json({ listenersActive });
});

export default router;