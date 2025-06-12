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
  { name: "APERTURA", description: "Aperturas con mancuernas para activar y abrir el pectoral mayor antes del trabajo principal." },
  { name: "PULL OVER", description: "Pull-over con mancuerna o barra; énfasis en dorsal ancho y expansión torácica." },
  { name: "TRAPECIOS", description: "Encogimientos (shrugs) o remos altos para fortalecer la porción superior del trapecio." },
  { name: "HIP THRUST", description: "Extensión de cadera con la espalda apoyada; foco en glúteo mayor y estabilidad lumbo-pélvica." },
  { name: "BICEPS TRX", description: "Curl de bíceps en suspensión TRX ajustando el ángulo para regular la intensidad." },
  { name: "PRESS ARNOL", description: "Press Arnold con mancuernas, trabajando deltoides anterior, medial y rotación interna." },
  { name: "PRESS BANCA", description: "Press de banca convencional con barra para pectoral, tríceps y deltoides anterior." },
  { name: "SPRINT 10 MTS", description: "Aceleración máxima en 10 m, enfocada en salida explosiva y técnica de carrera." },
  { name: "PRESS INCLINADO", description: "Press de banca inclinado para mayor estímulo en porción clavicular del pectoral." },
  { name: "CAIDAS DE CAJON", description: "Drop-jump desde cajón buscando amortiguación reactiva y rápida extensión de cadera." },
  { name: "SALTOS AL CAJON", description: "Box jumps; potencia de tren inferior y coordinación." },
  { name: "BICEPS INCLINADO", description: "Curl inclinado con mancuernas para enfatizar cabeza larga del bíceps." },
  { name: "FONDOS DE TRICEPS", description: "Dips en paralelas o banco trabajando tríceps y pectoral inferior." },
  { name: "DOMINADAS SUPINAS", description: "Pull-ups con agarre supino; foco en bíceps y dorsal ancho." },
  { name: "ISO PUSH UNILATERAL", description: "Empuje isométrico a un brazo (pared o máquina) desarrollando estabilidad escapular." },
  { name: "PALL OFF ISOMETRICO", description: "Antirotación de core con banda elástica mantenida de forma isométrica." },
  { name: "FLEXIONES DE BRAZOS", description: "Push-ups estándar, core firme y rango completo." },
  { name: "PLANCHA COPENHAGUE", description: "Plancha lateral con apoyo de pierna en banco, activando aductores y oblicuos." },
  { name: "SALTO EN LARGO DOBLE", description: "Dos saltos horizontales consecutivos, midiendo distancia total." },
  { name: "SENTADILLA DE GEMELOS", description: "Sentadilla profunda priorizando la extensión de tobillos (sóleo/gastrocnemio)." },
  { name: "RETO DE TRACCION MM SS", description: "Circuito de tracción (remos + curls) contra reloj sin pausa." },
  { name: "PUENTE DE CUELLO ISOMETRICO", description: "Isometría de puente de cuello para fortalecer musculatura cervical." },
  { name: "LEÑADOR + BLOQUE POSICION DE CARRERA", description: "Wood-chop con cable seguido de isometría en posición de salida de sprint." },
  { name: "LANZAMIENTOS ROTACIONAL POR ENCIMA DE LA CABEZA", description: "Lanzamiento de balón medicinal por encima de la cabeza con rotación explosiva." },
  { name: "VUELOS LATERALES COMBINADOS", description: "Elevaciones laterales con variaciones de rango o tempo para deltoides medio." },
  { name: "CAMINATA OVER HEAD CON BARRA", description: "Farmer walk con barra sobre cabeza, trabajando core y estabilidad escapular." },
  { name: "LANZAMIENTOS A LA PARED DESDE PUENTE SUPINO", description: "Chest pass con balón medicinal partiendo de puente de glúteo." },
  { name: "ROTADORES EXTERNOS DE HOMBRO CON MC", description: "Rotaciones externas con minibanda/mancuerna ligera en posición 90-90." },
  { name: "COMBINACION DE PLANCHA FRONTAL LATERAL Y LATERAL", description: "Circuito isométrico alternando plancha frontal y laterales sin descanso." },
  { name: "CAMINATA GRANJERO 1 A 1.5 VEZ SU PESO CORPORAL", description: "Farmer carry con carga equivalente al 100-150 % del peso corporal." },
  { name: "SIT UP CON MANCUERNA UNILATERAL", description: "Sit-up sujetando mancuerna con un solo brazo para trabajo unilateral de core." },
  { name: "POSICION DE ACELERACION CAMBIOS", description: "Drills de salidas y cambios de dirección desde postura de aceleración." },
  { name: "SENTADILLAS", description: "Back squat barra alta; fuerza global de piernas y core." },
  { name: "DROP JUMP + SALTO DE OBSTACULO (PUEDE SER UNA VALLA O UN BANCO PLANO)", description: "Secuencia reactiva: drop-jump y salto inmediato sobre obstáculo." },
  { name: "SALTO CON CARGA POSICION ASIMETRICA", description: "Jump squat con lastre unilateral para potencia y estabilidad." },
  { name: "FLEXIONES CON DESPEGUE ASISTIDAS", description: "Flexiones pliométricas asistidas con bandas." },
  { name: "REMO PENDLEY", description: "Pendlay row con barra desde suelo, explosivo." },
  { name: "BICEPS ARMRAP (DE REPETICIONES) CON BARRA", description: "Curl AMRAP con barra (~-5/-10 % de 10 RM)." },
  { name: "SALTO TUCKS AVANZANDO EN ZIG ZAG", description: "Tuck jumps encadenados en trayectoria zig-zag." },
  { name: "ISOMETRIA DE ROTADORES EXTERNOS DE HOMBRO BOCA ABAJO", description: "Isometría prono de rotadores externos (posición 90°-90°)." }
]

exercises.each do |attrs|
  Exercise.find_or_create_by!(name: attrs[:name]) do |e|
    e.description = attrs[:description]
  end
end

def ex_id(name)
  Exercise.find_by!(name: name).id
end

def create_weeks_for_block(block, exercises_data)
  # Create 4 weeks for each block
  (1..4).each do |week_num|
    week = block.weeks.find_or_create_by!(week_number: week_num)
    
    # Create week exercises for each exercise in this block
    exercises_data.each do |exercise_data|
      exercise_id = exercise_data[:exercise_id]
      week_key = "week#{week_num}".to_sym
      week_data = exercise_data[:weeks][week_key]
      
      week.week_exercises.find_or_create_by!(exercise_id: exercise_id) do |we|
        we.sets = week_data[:sets]
        we.reps = week_data[:reps]
      end
    end
  end
end

routine = Routine.find_or_create_by!(title: "Rutina JSON", description: "Rutina importada del JSON", is_active: false)

# === Día 1 ===
day1 = routine.days.find_or_create_by!(name: "Día 1")

bloque1 = day1.blocks.find_or_create_by!(title: "Bloque 1")
create_weeks_for_block(bloque1, [
  { 
    exercise_id: ex_id("SALTO TUCKS AVANZANDO EN ZIG ZAG"), 
    weeks: {
      week1: { sets: 2, reps: 10 },
      week2: { sets: 2, reps: 10 },
      week3: { sets: 2, reps: 10 },
      week4: { sets: 2, reps: 10 }
    }
  },
  { 
    exercise_id: ex_id("LANZAMIENTOS ROTACIONAL POR ENCIMA DE LA CABEZA"), 
    weeks: {
      week1: { sets: 2, reps: 9 },
      week2: { sets: 2, reps: 9 },
      week3: { sets: 2, reps: 9 },
      week4: { sets: 2, reps: 9 }
    }
  },
  { 
    exercise_id: ex_id("POSICION DE ACELERACION CAMBIOS"), 
    weeks: {
      week1: { sets: 2, reps: 7 },
      week2: { sets: 2, reps: 7 },
      week3: { sets: 2, reps: 7 },
      week4: { sets: 2, reps: 7 }
    }
  }
])

bloque2 = day1.blocks.find_or_create_by!(title: "Bloque 2")
create_weeks_for_block(bloque2, [
  { 
    exercise_id: ex_id("SENTADILLAS"), 
    weeks: {
      week1: { sets: 3, reps: 3 },
      week2: { sets: 4, reps: 2 },
      week3: { sets: 5, reps: 1 },
      week4: { sets: 3, reps: 5 }
    }
  },
  { 
    exercise_id: ex_id("DROP JUMP + SALTO DE OBSTACULO (PUEDE SER UNA VALLA O UN BANCO PLANO)"), 
    weeks: {
      week1: { sets: 3, reps: 3 },
      week2: { sets: 4, reps: 4 },
      week3: { sets: 5, reps: 5 },
      week4: { sets: 3, reps: 5 }
    }
  },
  { 
    exercise_id: ex_id("SALTO CON CARGA POSICION ASIMETRICA"), 
    weeks: {
      week1: { sets: 3, reps: 3 },
      week2: { sets: 4, reps: 4 },
      week3: { sets: 5, reps: 5 },
      week4: { sets: 3, reps: 5 }
    }
  }
])

bloque3 = day1.blocks.find_or_create_by!(title: "Bloque 3")
create_weeks_for_block(bloque3, [
  { 
    exercise_id: ex_id("REMO PENDLEY"), 
    weeks: {
      week1: { sets: 3, reps: 9 },
      week2: { sets: 3, reps: 9 },
      week3: { sets: 3, reps: 9 },
      week4: { sets: 3, reps: 9 }
    }
  },
  { 
    exercise_id: ex_id("BICEPS ARMRAP (DE REPETICIONES) CON BARRA"), 
    weeks: {
      week1: { sets: 3, reps: 15 },
      week2: { sets: 3, reps: 15 },
      week3: { sets: 3, reps: 15 },
      week4: { sets: 3, reps: 15 }
    }
  },
  { 
    exercise_id: ex_id("PRESS INCLINADO"), 
    weeks: {
      week1: { sets: 3, reps: 20 },
      week2: { sets: 3, reps: 20 },
      week3: { sets: 3, reps: 20 },
      week4: { sets: 3, reps: 20 }
    }
  }
])

bloque4 = day1.blocks.find_or_create_by!(title: "Bloque 4")
create_weeks_for_block(bloque4, [
  { 
    exercise_id: ex_id("COMBINACION DE PLANCHA FRONTAL LATERAL Y LATERAL"), 
    weeks: {
      week1: { sets: 2, reps: 60 },
      week2: { sets: 2, reps: 60 },
      week3: { sets: 2, reps: 60 },
      week4: { sets: 2, reps: 60 }
    }
  },
  { 
    exercise_id: ex_id("CAMINATA GRANJERO 1 A 1.5 VEZ SU PESO CORPORAL"), 
    weeks: {
      week1: { sets: 2, reps: 55 },
      week2: { sets: 2, reps: 55 },
      week3: { sets: 2, reps: 55 },
      week4: { sets: 2, reps: 55 }
    }
  },
  { 
    exercise_id: ex_id("PUENTE DE CUELLO ISOMETRICO"), 
    weeks: {
      week1: { sets: 2, reps: 30 },
      week2: { sets: 2, reps: 30 },
      week3: { sets: 2, reps: 30 },
      week4: { sets: 2, reps: 30 }
    }
  }
])

# === Día 2 ===
day2 = routine.days.find_or_create_by!(name: "Día 2")

bloque1 = day2.blocks.find_or_create_by!(title: "Bloque 1")
create_weeks_for_block(bloque1, [
  { 
    exercise_id: ex_id("CAIDAS DE CAJON"), 
    weeks: {
      week1: { sets: 3, reps: 5 },
      week2: { sets: 3, reps: 5 },
      week3: { sets: 3, reps: 5 },
      week4: { sets: 3, reps: 5 }
    }
  },
  { 
    exercise_id: ex_id("ISOMETRIA DE ROTADORES EXTERNOS DE HOMBRO BOCA ABAJO"), 
    weeks: {
      week1: { sets: 3, reps: 10 },
      week2: { sets: 3, reps: 10 },
      week3: { sets: 3, reps: 10 },
      week4: { sets: 3, reps: 10 }
    }
  },
  { 
    exercise_id: ex_id("ISO PUSH UNILATERAL"), 
    weeks: {
      week1: { sets: 3, reps: 2 },
      week2: { sets: 3, reps: 2 },
      week3: { sets: 3, reps: 2 },
      week4: { sets: 3, reps: 2 }
    }
  }
])

bloque2 = day2.blocks.find_or_create_by!(title: "Bloque 2")
create_weeks_for_block(bloque2, [
  { 
    exercise_id: ex_id("PRESS BANCA"), 
    weeks: {
      week1: { sets: 3, reps: 3 },
      week2: { sets: 4, reps: 2 },
      week3: { sets: 5, reps: 1 },
      week4: { sets: 3, reps: 5 }
    }
  },
  { 
    exercise_id: ex_id("FLEXIONES CON DESPEGUE ASISTIDAS"), 
    weeks: {
      week1: { sets: 3, reps: 3 },
      week2: { sets: 4, reps: 4 },
      week3: { sets: 5, reps: 5 },
      week4: { sets: 3, reps: 5 }
    }
  }
])

bloque3 = day2.blocks.find_or_create_by!(title: "Bloque 3")
create_weeks_for_block(bloque3, [
  { 
    exercise_id: ex_id("APERTURA"), 
    weeks: {
      week1: { sets: 1, reps: 10 },
      week2: { sets: 1, reps: 10 },
      week3: { sets: 1, reps: 10 },
      week4: { sets: 1, reps: 10 }
    }
  },
  { 
    exercise_id: ex_id("FONDOS DE TRICEPS"), 
    weeks: {
      week1: { sets: 1, reps: 15 },
      week2: { sets: 1, reps: 15 },
      week3: { sets: 1, reps: 15 },
      week4: { sets: 1, reps: 15 }
    }
  },
  { 
    exercise_id: ex_id("VUELOS LATERALES COMBINADOS"), 
    weeks: {
      week1: { sets: 1, reps: 20 },
      week2: { sets: 1, reps: 20 },
      week3: { sets: 1, reps: 20 },
      week4: { sets: 1, reps: 20 }
    }
  }
])

bloque4 = day2.blocks.find_or_create_by!(title: "Bloque 4")
create_weeks_for_block(bloque4, [
  { 
    exercise_id: ex_id("RETO DE TRACCION MM SS"), 
    weeks: {
      week1: { sets: 2, reps: 70 },
      week2: { sets: 2, reps: 70 },
      week3: { sets: 2, reps: 70 },
      week4: { sets: 2, reps: 70 }
    }
  },
  { 
    exercise_id: ex_id("CAMINATA OVER HEAD CON BARRA"), 
    weeks: {
      week1: { sets: 2, reps: 50 },
      week2: { sets: 2, reps: 50 },
      week3: { sets: 2, reps: 50 },
      week4: { sets: 2, reps: 50 }
    }
  }
])

# === Día 3 ===
day3 = routine.days.find_or_create_by!(name: "Día 3")

bloque1 = day3.blocks.find_or_create_by!(title: "Bloque 1")
create_weeks_for_block(bloque1, [
  { 
    exercise_id: ex_id("LEÑADOR + BLOQUE POSICION DE CARRERA"), 
    weeks: {
      week1: { sets: 3, reps: 4 },
      week2: { sets: 3, reps: 4 },
      week3: { sets: 3, reps: 4 },
      week4: { sets: 3, reps: 4 }
    }
  },
  { 
    exercise_id: ex_id("PALL OFF ISOMETRICO"), 
    weeks: {
      week1: { sets: 3, reps: 20 },
      week2: { sets: 3, reps: 20 },
      week3: { sets: 3, reps: 20 },
      week4: { sets: 3, reps: 20 }
    }
  }
])

bloque2 = day3.blocks.find_or_create_by!(title: "Bloque 2")
create_weeks_for_block(bloque2, [
  { 
    exercise_id: ex_id("HIP THRUST"), 
    weeks: {
      week1: { sets: 3, reps: 3 },
      week2: { sets: 4, reps: 2 },
      week3: { sets: 5, reps: 1 },
      week4: { sets: 3, reps: 5 }
    }
  },
  { 
    exercise_id: ex_id("SALTO EN LARGO DOBLE"), 
    weeks: {
      week1: { sets: 3, reps: 3 },
      week2: { sets: 4, reps: 2 },
      week3: { sets: 5, reps: 1 },
      week4: { sets: 3, reps: 3 }
    }
  },
  { 
    exercise_id: ex_id("SPRINT 10 MTS"), 
    weeks: {
      week1: { sets: 3, reps: 3 },
      week2: { sets: 4, reps: 2 },
      week3: { sets: 5, reps: 1 },
      week4: { sets: 3, reps: 3 }
    }
  }
])

bloque3 = day3.blocks.find_or_create_by!(title: "Bloque 3")
create_weeks_for_block(bloque3, [
  { 
    exercise_id: ex_id("DOMINADAS SUPINAS"), 
    weeks: {
      week1: { sets: 3, reps: 5 },
      week2: { sets: 3, reps: 5 },
      week3: { sets: 3, reps: 5 },
      week4: { sets: 3, reps: 5 }
    }
  },
  { 
    exercise_id: ex_id("SIT UP CON MANCUERNA UNILATERAL"), 
    weeks: {
      week1: { sets: 3, reps: 10 },
      week2: { sets: 3, reps: 10 },
      week3: { sets: 3, reps: 10 },
      week4: { sets: 3, reps: 10 }
    }
  }
])

bloque4 = day3.blocks.find_or_create_by!(title: "Bloque 4")
create_weeks_for_block(bloque4, [
  { 
    exercise_id: ex_id("PRESS INCLINADO"), 
    weeks: {
      week1: { sets: 3, reps: 10 },
      week2: { sets: 3, reps: 10 },
      week3: { sets: 3, reps: 10 },
      week4: { sets: 3, reps: 10 }
    }
  },
  { 
    exercise_id: ex_id("FLEXIONES DE BRAZOS"), 
    weeks: {
      week1: { sets: 3, reps: 20 },
      week2: { sets: 3, reps: 20 },
      week3: { sets: 3, reps: 20 },
      week4: { sets: 3, reps: 20 }
    }
  },
  { 
    exercise_id: ex_id("PRESS ARNOL"), 
    weeks: {
      week1: { sets: 3, reps: 20 },
      week2: { sets: 3, reps: 20 },
      week3: { sets: 3, reps: 20 },
      week4: { sets: 3, reps: 20 }
    }
  }
])

# === Día 4 ===
day4 = routine.days.find_or_create_by!(name: "Día 4")

bloque1 = day4.blocks.find_or_create_by!(title: "Bloque 1")
create_weeks_for_block(bloque1, [
  { 
    exercise_id: ex_id("PLANCHA COPENHAGUE"), 
    weeks: {
      week1: { sets: 2, reps: 20 },
      week2: { sets: 2, reps: 20 },
      week3: { sets: 2, reps: 20 },
      week4: { sets: 2, reps: 20 }
    }
  },
  { 
    exercise_id: ex_id("SENTADILLA DE GEMELOS"), 
    weeks: {
      week1: { sets: 2, reps: 10 },
      week2: { sets: 2, reps: 10 },
      week3: { sets: 2, reps: 10 },
      week4: { sets: 2, reps: 10 }
    }
  },
  { 
    exercise_id: ex_id("ROTADORES EXTERNOS DE HOMBRO CON MC"), 
    weeks: {
      week1: { sets: 2, reps: 12 },
      week2: { sets: 2, reps: 12 },
      week3: { sets: 2, reps: 12 },
      week4: { sets: 2, reps: 12 }
    }
  }
])

bloque2 = day4.blocks.find_or_create_by!(title: "Bloque 2")
create_weeks_for_block(bloque2, [
  { 
    exercise_id: ex_id("PULL OVER"), 
    weeks: {
      week1: { sets: 3, reps: 5 },
      week2: { sets: 3, reps: 5 },
      week3: { sets: 3, reps: 5 },
      week4: { sets: 3, reps: 5 }
    }
  },
  { 
    exercise_id: ex_id("LANZAMIENTOS A LA PARED DESDE PUENTE SUPINO"), 
    weeks: {
      week1: { sets: 3, reps: 4 },
      week2: { sets: 3, reps: 4 },
      week3: { sets: 3, reps: 4 },
      week4: { sets: 3, reps: 4 }
    }
  },
  { 
    exercise_id: ex_id("SALTOS AL CAJON"), 
    weeks: {
      week1: { sets: 3, reps: 5 },
      week2: { sets: 3, reps: 5 },
      week3: { sets: 3, reps: 5 },
      week4: { sets: 3, reps: 5 }
    }
  }
])

bloque3 = day4.blocks.find_or_create_by!(title: "Bloque 3")
create_weeks_for_block(bloque3, [
  { 
    exercise_id: ex_id("BICEPS INCLINADO"), 
    weeks: {
      week1: { sets: 3, reps: 10 },
      week2: { sets: 3, reps: 10 },
      week3: { sets: 3, reps: 10 },
      week4: { sets: 3, reps: 10 }
    }
  },
  { 
    exercise_id: ex_id("BICEPS TRX"), 
    weeks: {
      week1: { sets: 3, reps: 15 },
      week2: { sets: 3, reps: 15 },
      week3: { sets: 3, reps: 15 },
      week4: { sets: 3, reps: 15 }
    }
  },
  { 
    exercise_id: ex_id("TRAPECIOS"), 
    weeks: {
      week1: { sets: 3, reps: 20 },
      week2: { sets: 3, reps: 20 },
      week3: { sets: 3, reps: 20 },
      week4: { sets: 3, reps: 20 }
    }
  }
])

puts "Seed data created successfully!"

