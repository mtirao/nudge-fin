
1. Resumen Ejecutivo

NudgeFin es una aplicación móvil de finanzas personales conductuales (FinTech + Behavioral Economics). A diferencia de las apps tradicionales que registran gastos de forma reactiva, NudgeFin utiliza análisis predictivo para identificar las ventanas de tiempo críticas donde el usuario gasta dinero de forma impulsiva y envía un "Nudge" (notificación push preventiva) 30 minutos antes para evitar el gasto, redirigiendo ese capital hacia una meta de ahorro motivacional.

2. Stack Tecnológico Aprobado

• Frontend: React Native (Expo) + TypeScript + Tailwind CSS (NativeWind) o StyleSheet.
• Backend: Python (FastAPI) + Uvicorn + Pydantic.
• Base de Datos: PostgreSQL (alojado en Supabase para manejo rápido de Auth y almacenamiento).
• Análisis de Datos: Pandas + NumPy (para el procesamiento de patrones temporales).
• Notificaciones: Expo Notifications (Locales para MVP) / Firebase Cloud Messaging (FCM para Producción).

3. Flujo Crítico de Datos (User Journey Técnico)

1. El usuario ingresa su meta (ej. "Viaje a Japón - $3,000").
2. El usuario carga su historial de gastos (simulado vía archivo CSV o Mock API).
3. El Backend analiza los timestamps de los gastos y detecta anomalías o picos repetitivos (ej. Todos los viernes a las 7:00 PM).
4. El sistema agenda un cron job o alerta que detona una notificación push al celular del usuario a las 6:30 PM.
5. El usuario decide si cede al impulso o ahorra. Si ahorra, lo registra y se actualiza el contador de "Dinero Rescatado".
