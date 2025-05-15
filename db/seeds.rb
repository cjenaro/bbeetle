# This file should ensure the existence of records required to run the application in every environment (production,
# development, test). The code here should be idempotent so that it can be executed at any point in every environment.
# The data can then be loaded with the bin/rails db:seed command (or created alongside the database with db:setup).
#
# Example:
#
#   ["Action", "Comedy", "Drama", "Horror"].each do |genre_name|
#     MovieGenre.find_or_create_by!(name: genre_name)
#   end

exercises = [
  { name: "Pogos mas Tuck Avanzado 10MTS", description: "Salto pliométrico avanzado con tuck, realizado durante 10 metros." },
  { name: "Lanzamiento Rotacional por encima de la cabeza", description: "Lanzamiento rotacional por encima de la cabeza, generalmente con balón medicinal." },
  { name: "Posicion Aceleracion Cargo Rompe", description: "Ejercicio de aceleración desde posición estática, rompiendo la inercia con carga." },
  { name: "Sentadillas", description: "Ejercicio básico de fuerza para tren inferior, flexionando rodillas y caderas." },
  { name: "Drop Jump", description: "Salto pliométrico descendiendo desde una plataforma o caja." },
  { name: "Salto Con Cargo PCS, PC", description: "Salto con carga, posiblemente con barra o peso adicional (PCS/PC hace referencia a la posición o tipo de carga)." },
  { name: "Saltos Antirrotación con Banda, posición de plan de asimétrica", description: "Saltos con banda elástica evitando la rotación, desde posición de plancha asimétrica." },
  { name: "Ramos Pendlay", description: "Remo Pendlay, remo con barra desde el suelo de forma explosiva." },
  { name: "Biceps 1 brazo dinamico & Isom Isometrico", description: "Curl de bíceps a un brazo combinando fases dinámicas e isométricas." },
  { name: "Vueltas combinadas", description: "Ejercicio de rotación o giro del torso, combinando diferentes direcciones." },
  { name: "Caminata griega y con el peso corporal", description: "Caminata funcional usando solo el peso corporal, estilo griego." },
  { name: "Cuello banda (alternando direcciones)", description: "Ejercicio de cuello con banda elástica, alternando direcciones de resistencia." },
  { name: "Caida de Cajon (Recepcion de peso)", description: "Caída controlada desde una caja, enfocada en la recepción y absorción del peso." },
  { name: "Face Pull TRX", description: "Face pull usando TRX, para fortalecer la parte superior de la espalda y hombros." },
  { name: "Iso Push Unilateral", description: "Empuje isométrico unilateral, manteniendo la posición con un solo brazo." },
  { name: "Hip Thrust", description: "Elevación de cadera apoyando la espalda en un banco, para glúteos e isquiotibiales." },
  { name: "Salto largo", description: "Salto horizontal buscando máxima distancia." },
  { name: "Sprint 5 a 10 mts", description: "Aceleración máxima en distancias cortas de 5 a 10 metros." },
  { name: "Press banca", description: "Press de banca tradicional, ejercicio de fuerza para pectorales." },
  { name: "Press hombre Barra en punta", description: "Press de hombro con barra apoyada en un extremo (landmine press)." },
  { name: "Press Banca agarre cerrado", description: "Press de banca con agarre cerrado, enfocado en tríceps." },
  { name: "Trapecios", description: "Ejercicio de encogimiento de hombros para trabajar trapecios." },
  { name: "Caminata Over Head barra", description: "Caminata sosteniendo una barra por encima de la cabeza." },
  { name: "Twist Con Barra Parado", description: "Giros de torso de pie con barra, para oblicuos y core." },
  { name: "Levantador con barra", description: "Levantamiento de barra desde el suelo, tipo peso muerto o cargada." },
  { name: "Pall Off / Fisico en hombro", description: "Pallof press o empuje anti-rotacional con banda, a la altura del hombro." },
  { name: "Pull Apart Banco plano/ en banco isometrico, el otro dinamico", description: "Pull apart con banda, un brazo en isométrico y el otro en movimiento." },
  { name: "Lanzamientos Unilaterales de Pecho", description: "Lanzamiento de balón medicinal con un solo brazo, desde el pecho." },
  { name: "Flexiones de Brazos asistidas", description: "Flexiones de brazos con asistencia para facilitar el movimiento." },
  { name: "Press inclinado", description: "Press de banca en banco inclinado, para pectoral superior." },
  { name: "Vueltas Combinadas", description: "Ejercicio de rotación de torso, combinando diferentes planos." },
  { name: "Vueltas Posteriores", description: "Rotaciones hacia atrás, para movilidad y core." },
  { name: "Plancha + Frontale + Lateral + Lateral", description: "Secuencia de planchas: frontal y laterales, para core completo." },
  { name: "Sit Up con Mancuerna Unilateral", description: "Abdominales tipo sit-up sosteniendo mancuerna con un solo brazo." },
  { name: "Iso hold Tabilla", description: "Plancha isométrica, manteniendo la posición de tabla." },
  { name: "Hip Thrust Unilateral", description: "Elevación de cadera con una sola pierna, para glúteos." },
  { name: "Saltos Laterales (Soporte en Oblicuo Puede ser valla o Banco Plano)", description: "Saltos laterales apoyando en un objeto, trabajando oblicuos y estabilidad." },
  { name: "drop de banco", description: "Descenso controlado desde un banco, para pliometría y absorción de impacto." },
  { name: "Sentadillas isometricas (altura de 1/4 sentadilla)", description: "Sentadilla isométrica en posición de cuarto de sentadilla." },
  { name: "Saltos Continuos", description: "Saltos repetidos sin pausa, para resistencia y potencia." },
  { name: "Lanzamiento por encima de la cabeza con carga", description: "Lanzamiento de peso por encima de la cabeza, generalmente con balón medicinal." },
  { name: "Biceps", description: "Ejercicio de flexión de codo para trabajar bíceps." },
  { name: "Triceps", description: "Ejercicio de extensión de codo para trabajar tríceps." }
]

exercises.each do |attrs|
  Exercise.find_or_create_by!(name: attrs[:name]) do |e|
    e.description = attrs[:description]
  end
end

def ex_id(name)
  Exercise.find_by!(name: name).id
end

routine = Routine.find_or_create_by!(title: "Rutina PDF", description: "Rutina importada del PDF", is_active: false)

# === Día 1 ===
day1 = routine.days.find_or_create_by!(name: "Día 1")
bloque1 = day1.blocks.find_or_create_by!(title: "Bloque 1")
bloque1.block_exercises.find_or_create_by!(exercise_id: ex_id("Pogos mas Tuck Avanzado 10MTS"), sets: 2, reps: 10)
bloque1.block_exercises.find_or_create_by!(exercise_id: ex_id("Lanzamiento Rotacional por encima de la cabeza"), sets: 2, reps: 8)
bloque1.block_exercises.find_or_create_by!(exercise_id: ex_id("Posicion Aceleracion Cargo Rompe"), sets: 2, reps: 3)
bloque1.block_exercises.find_or_create_by!(exercise_id: ex_id("Sentadillas"), sets: 4, reps: 1)

bloque2 = day1.blocks.find_or_create_by!(title: "Bloque 2")
bloque2.block_exercises.find_or_create_by!(exercise_id: ex_id("Drop Jump"), sets: 4, reps: 3)
bloque2.block_exercises.find_or_create_by!(exercise_id: ex_id("Salto Con Cargo PCS, PC"), sets: 4, reps: 3)
bloque2.block_exercises.find_or_create_by!(exercise_id: ex_id("Saltos Antirrotación con Banda, posición de plan de asimétrica"), sets: 4, reps: 3)
bloque2.block_exercises.find_or_create_by!(exercise_id: ex_id("Ramos Pendlay"), sets: 4, reps: 8)

bloque3 = day1.blocks.find_or_create_by!(title: "Bloque 3")
bloque3.block_exercises.find_or_create_by!(exercise_id: ex_id("Biceps 1 brazo dinamico & Isom Isometrico"), sets: 3, reps: 10)
bloque3.block_exercises.find_or_create_by!(exercise_id: ex_id("Vueltas combinadas"), sets: 3, reps: 15)
bloque3.block_exercises.find_or_create_by!(exercise_id: ex_id("Caminata griega y con el peso corporal"), sets: 3, reps: 15)
bloque3.block_exercises.find_or_create_by!(exercise_id: ex_id("Cuello banda (alternando direcciones)"), sets: 3, reps: 10)

# === Día 2 ===
day2 = routine.days.find_or_create_by!(name: "Día 2")
bloque1 = day2.blocks.find_or_create_by!(title: "Bloque 1")
bloque1.block_exercises.find_or_create_by!(exercise_id: ex_id("Caida de Cajon (Recepcion de peso)"), sets: 2, reps: 8)
bloque1.block_exercises.find_or_create_by!(exercise_id: ex_id("Face Pull TRX"), sets: 2, reps: 8)
bloque1.block_exercises.find_or_create_by!(exercise_id: ex_id("Iso Push Unilateral"), sets: 2, reps: 3)

bloque2 = day2.blocks.find_or_create_by!(title: "Bloque 2")
bloque2.block_exercises.find_or_create_by!(exercise_id: ex_id("Hip Thrust"), sets: 4, reps: 1)
bloque2.block_exercises.find_or_create_by!(exercise_id: ex_id("Salto largo"), sets: 4, reps: 3)
bloque2.block_exercises.find_or_create_by!(exercise_id: ex_id("Sprint 5 a 10 mts"), sets: 4, reps: 3)
bloque2.block_exercises.find_or_create_by!(exercise_id: ex_id("Press banca"), sets: 4, reps: 6)

bloque3 = day2.blocks.find_or_create_by!(title: "Bloque 3")
bloque3.block_exercises.find_or_create_by!(exercise_id: ex_id("Press hombre Barra en punta"), sets: 3, reps: 8)
bloque3.block_exercises.find_or_create_by!(exercise_id: ex_id("Press Banca agarre cerrado"), sets: 3, reps: 10)
bloque3.block_exercises.find_or_create_by!(exercise_id: ex_id("Trapecios"), sets: 3, reps: 15)

bloque4 = day2.blocks.find_or_create_by!(title: "Bloque 4")
bloque4.block_exercises.find_or_create_by!(exercise_id: ex_id("Caminata Over Head barra"), sets: 2, reps: 48)
bloque4.block_exercises.find_or_create_by!(exercise_id: ex_id("Twist Con Barra Parado"), sets: 2, reps: 16)

# === Día 3 ===
day3 = routine.days.find_or_create_by!(name: "Día 3")
bloque1 = day3.blocks.find_or_create_by!(title: "Bloque 1")
bloque1.block_exercises.find_or_create_by!(exercise_id: ex_id("Levantador con barra"), sets: 2, reps: 8)
bloque1.block_exercises.find_or_create_by!(exercise_id: ex_id("Pall Off / Fisico en hombro"), sets: 2, reps: 8)
bloque1.block_exercises.find_or_create_by!(exercise_id: ex_id("Pull Apart Banco plano/ en banco isometrico, el otro dinamico"), sets: 2, reps: 5)

bloque2 = day3.blocks.find_or_create_by!(title: "Bloque 2")
bloque2.block_exercises.find_or_create_by!(exercise_id: ex_id("Press banca"), sets: 4, reps: 1)

bloque3 = day3.blocks.find_or_create_by!(title: "Bloque 3")
bloque3.block_exercises.find_or_create_by!(exercise_id: ex_id("Lanzamientos Unilaterales de Pecho"), sets: 4, reps: 3)
bloque3.block_exercises.find_or_create_by!(exercise_id: ex_id("Flexiones de Brazos asistidas"), sets: 4, reps: 5)
bloque3.block_exercises.find_or_create_by!(exercise_id: ex_id("Press inclinado"), sets: 4, reps: 4)

bloque4 = day3.blocks.find_or_create_by!(title: "Bloque 4")
bloque4.block_exercises.find_or_create_by!(exercise_id: ex_id("Vueltas Combinadas"), sets: 3, reps: 8)
bloque4.block_exercises.find_or_create_by!(exercise_id: ex_id("Vueltas Posteriores"), sets: 3, reps: 10)

bloque5 = day3.blocks.find_or_create_by!(title: "Bloque 5")
bloque5.block_exercises.find_or_create_by!(exercise_id: ex_id("Plancha + Frontale + Lateral + Lateral"), sets: 3, reps: 15)
bloque5.block_exercises.find_or_create_by!(exercise_id: ex_id("Sit Up con Mancuerna Unilateral"), sets: 2, reps: 8)
bloque5.block_exercises.find_or_create_by!(exercise_id: ex_id("Iso hold Tabilla"), sets: 2, reps: 15)

# === Día 4 ===
day4 = routine.days.find_or_create_by!(name: "Día 4")
bloque1 = day4.blocks.find_or_create_by!(title: "Bloque 1")
bloque1.block_exercises.find_or_create_by!(exercise_id: ex_id("Hip Thrust Unilateral"), sets: 2, reps: 4)
bloque1.block_exercises.find_or_create_by!(exercise_id: ex_id("Saltos Laterales (Soporte en Oblicuo Puede ser valla o Banco Plano)"), sets: 2, reps: 4)
bloque1.block_exercises.find_or_create_by!(exercise_id: ex_id("drop de banco"), sets: 2, reps: 4)
bloque1.block_exercises.find_or_create_by!(exercise_id: ex_id("Sentadillas isometricas (altura de 1/4 sentadilla)"), sets: 2, reps: 2)

bloque2 = day4.blocks.find_or_create_by!(title: "Bloque 2")
bloque2.block_exercises.find_or_create_by!(exercise_id: ex_id("Saltos Continuos"), sets: 3, reps: 3)
bloque2.block_exercises.find_or_create_by!(exercise_id: ex_id("Lanzamiento por encima de la cabeza con carga"), sets: 3, reps: 3)
bloque2.block_exercises.find_or_create_by!(exercise_id: ex_id("Biceps"), sets: 2, reps: 3)
bloque2.block_exercises.find_or_create_by!(exercise_id: ex_id("Triceps"), sets: 2, reps: 3)

