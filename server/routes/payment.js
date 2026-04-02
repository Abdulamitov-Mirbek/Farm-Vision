// server/routes/payment.js
const express = require('express');
const axios = require('axios');
const router = express.Router();

// Ваши данные от YooKassa
const YOOKASSA_SHOP_ID = 'ВАШ_SHOP_ID';
const YOOKASSA_SECRET_KEY = 'ВАШ_SECRET_KEY';

// Создание платежа
router.post('/create-payment', async (req, res) => {
  try {
    const { amount, description, metadata } = req.body;
    
    const payment = await axios({
      method: 'POST',
      url: 'https://api.yookassa.ru/v3/payments',
      headers: {
        'Content-Type': 'application/json',
        'Idempotence-Key': Date.now().toString(),
      },
      auth: {
        username: YOOKASSA_SHOP_ID,
        password: YOOKASSA_SECRET_KEY,
      },
      data: {
        amount: {
          value: amount,
          currency: 'RUB',
        },
        capture: true,
        confirmation: {
          type: 'redirect',
          return_url: 'https://ваш-сайт.ru/payment/success',
        },
        description,
        metadata,
        receipt: {
          customer: {
            email: 'customer@example.com',
          },
          items: [
            {
              description: 'Подписка Farm Vision Premium',
              quantity: 1,
              amount: {
                value: amount,
                currency: 'RUB',
              },
              vat_code: 1,
            },
          ],
        },
      },
    });

    res.json({
      success: true,
      payment_url: payment.data.confirmation.confirmation_url,
      payment_id: payment.data.id,
    });

  } catch (error) {
    console.error('YooKassa error:', error.response?.data || error.message);
    res.status(500).json({
      success: false,
      error: 'Ошибка создания платежа',
    });
  }
});

// Проверка статуса платежа
router.get('/payment-status/:paymentId', async (req, res) => {
  try {
    const { paymentId } = req.params;
    
    const payment = await axios({
      method: 'GET',
      url: `https://api.yookassa.ru/v3/payments/${paymentId}`,
      auth: {
        username: YOOKASSA_SHOP_ID,
        password: YOOKASSA_SECRET_KEY,
      },
    });

    res.json({
      success: true,
      status: payment.data.status,
      payment: payment.data,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Ошибка получения статуса',
    });
  }
});

module.exports = router;