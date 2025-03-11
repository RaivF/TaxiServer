const express = require('express')
const cors = require('cors') // Для обработки CORS
const axios = require('axios') // Для отправки сообщений в Telegram

const app = express()

// Middleware
app.use(cors()) // Разрешаем запросы с любого источника
app.use(express.json()) // Для обработки JSON-данных

// Токен вашего бота и chat_id
const TELEGRAM_BOT_TOKEN = '7673196064:AAGoAJFZpKnb63QDhkC_pcxrnT7Q3RYG858'
const TELEGRAM_CHAT_ID = 1114712689

export const getChatId = async () => {
	const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/getUpdates`

	try {
		const response = await axios.post(url)
		console.log('Ответ от Telegram:', response.data)

		// Извлекаем chat_id из ответа
		if (response.data.ok && response.data.result.length > 0) {
			const chatId = response.data.result[length - 1].message.chat.id
			console.log('Ваш chat_id:', chatId)
			TELEGRAM_CHAT_ID = chatId
		} else {
			console.log('Нет новых сообщений или обновлений.')
			return null
		}
	} catch (error) {
		console.error('Ошибка:', error)
		throw error
	}
}
getChatId()
// Функция для отправки сообщения в Telegram
const sendTelegramMessage = async text => {
	try {
		const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`
		const response = await axios.post(url, {
			chat_id: TELEGRAM_CHAT_ID,
			text: text,
		})
		console.log('Сообщение отправлено в Telegram:', response.data)
	} catch (error) {
		console.error('Ошибка при отправке сообщения в Telegram:', error)
	}
}

// Обработчик POST-запросов
app.post('/message', async (req, res) => {
	const { from, to, additional } = req.body

	// Формируем сообщение
	const message = `Новый заказ такси:\nОткуда: ${from}\nКуда: ${to}\nДополнительно: ${additional}`

	// Отправляем сообщение в Telegram
	await sendTelegramMessage(message)

	// Отправляем ответ клиенту
	res.send('Сообщение отправлено в Telegram')
})

// Запуск сервера
const PORT = 3000
app.listen(PORT, () => {
	console.log(`Сервер запущен на http://localhost:${PORT}`)
})
