const express = require('express');
const Card = require('../models/Card');
const internalErrorResponse = require('../utils/internalErrorResponse');
const checkAuth = require('../middleware/check-auth');
const Column = require('../models/Column');

const cardRouter = express.Router();

// create new card
cardRouter.post('/', checkAuth, async (req, res, next) => {
  try {
    const { title, columnId, cardId } = req.body;
    await Card.find().exec();
    const newCard = new Card({
      title,
      column: columnId,
      cardId,
    });
    const result = await newCard.save();
    const column = await Column.findOne({ columnId }).exec();
    if (!column) {
      return res
        .status(404)
        .json({ message: "Column of provided id doesn't exist" });
    }
    const newCardIds = Array.from(column.cardIds);
    newCardIds.push(result.cardId);
    column.set({ cardIds: newCardIds });
    const result2 = await column.save();
    return res.status(201).json({
      message: 'new card is created',
      card: result,
      column: result2,
    });
  } catch (e) {
    return internalErrorResponse(e, res);
  }
});

const findAllCards = columnId =>
  Card.find({ column: columnId }).select('cardId title');

// getAllCards
cardRouter.post('/getallcards', checkAuth, async (req, res) => {
  try {
    const { columnIds } = req.body;

    let totalCards = [];
    if (columnIds && columnIds.length > 0) {
      let i = 0;
      for (const columnId of columnIds) {
        const cards = await findAllCards(columnId);

        if (cards.length > 0) {
          totalCards.push(cards);
        }
      }
      return res.status(200).json({ message: 'Success', cards: totalCards });
    }
  } catch (error) {
    internalErrorResponse(error, res);
  }
});

//  edit the title of the card


cardRouter.post('/card/:cardId', checkAuth, async (req, res) => {
  try {
    const { cardId } = req.params;

    if (req.query.title) {
      const card = await Card.findOneAndUpdate(cardId, {
        content: req.body.title,
      }).exec();
      if (!card) {
        return res
          .status(404)
          .json({ message: 'unable to find card of provided Id' });
      }
      return res
        .status(201)
        .json({ message: 'card content/title updated', data: card.content });
    }
  } catch (e) {
    return internalErrorResponse(e, res);
  }
});

cardRouter.post('/reorder/samecolumn', checkAuth, async (req, res, next) => {
  try {
    const { sameColumnId, samecolumnCardIds } = req.body;
    console.log(sameColumnId, samecolumnCardIds);
    const column = await Column.findOne({ columnId: sameColumnId });
    if (!column) {
      return res
        .status(404)
        .json({ message: 'unable to find column of provided id' });
    }
    column.set({ cardIds: samecolumnCardIds });
    const savedColumn = await column.save();

    return res
      .status(200)
      .json({ message: 'same column reorder success', savedColumn });
  } catch (e) {
    return internalErrorResponse(e, res);
  }
});

cardRouter.post(
  '/reorder/differentcolumn',
  checkAuth,
  async (req, res, next) => {
    try {
      const {
        removedColumnId,
        addedColumnId,
        removedColumnCardIds,
        addedColumnCardIds,
      } = req.body;
      if (
        !(
          removedColumnId &&
          addedColumnId &&
          removedColumnCardIds &&
          addedColumnCardIds
        )
      ) {
        return res.status(400).json({ message: 'some fields are missing' });
      }

      const removedcolumn = await Column.findOne({ columnId: removedColumnId });
      removedcolumn.set({ cardIds: removedColumnCardIds });
      await removedcolumn.save();
      const addedcolumn = await Column.findOne({ columnId: addedColumnId });
      addedcolumn.set({ cardIds: addedColumnCardIds });
      await addedcolumn.save();
      return res
        .status(200)
        .json({ message: 'different column reorder success' });
    } catch (e) {
      return internalErrorResponse(e, res);
    }
  }
);

module.exports = cardRouter;
