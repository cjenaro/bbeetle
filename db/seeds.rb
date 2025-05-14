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
  { name: "Push-up", description: "A bodyweight exercise targeting chest, shoulders, and triceps." },
  { name: "Pull-up", description: "An upper-body exercise focusing on back and biceps, performed hanging from a bar." },
  { name: "Squat", description: "A compound movement working the legs and glutes." },
  { name: "Deadlift", description: "A full-body lift emphasizing posterior chain strength." },
  { name: "Bench Press", description: "A chest exercise performed lying on a bench, pressing a barbell upward." },
  { name: "Overhead Press", description: "A shoulder exercise pressing weight overhead from shoulder height." },
  { name: "Barbell Row", description: "A back exercise pulling a barbell toward the torso from a bent-over position." },
  { name: "Bicep Curl", description: "An isolation exercise for the biceps using dumbbells or a barbell." },
  { name: "Tricep Dip", description: "A bodyweight movement targeting the triceps, performed on parallel bars or a bench." },
  { name: "Lunge", description: "A lower-body exercise stepping forward or backward, working quads and glutes." },
  { name: "Plank", description: "A core stability exercise holding a straight-body position on elbows or hands." },
  { name: "Mountain Climber", description: "A cardio and core exercise performed in a plank, driving knees toward chest." },
  { name: "Burpee", description: "A full-body movement combining a squat, push-up, and jump." },
  { name: "Jumping Jack", description: "A cardio move jumping legs apart and arms overhead, then returning to start." },
  { name: "Russian Twist", description: "A core exercise twisting the torso side to side, often with weight." },
  { name: "Leg Raise", description: "A lower ab exercise lifting legs while lying on your back." },
  { name: "Crunch", description: "A basic abdominal exercise curling the shoulders toward the pelvis." },
  { name: "Sit-up", description: "A core exercise raising the torso to a sitting position from lying down." },
  { name: "Hip Thrust", description: "A glute-focused movement driving hips upward with shoulders on a bench." },
  { name: "Glute Bridge", description: "A bodyweight exercise lifting hips off the ground to work glutes and hamstrings." },
  { name: "Calf Raise", description: "An exercise for the calves, rising onto the balls of the feet." },
  { name: "Lat Pulldown", description: "A machine exercise pulling a bar down to the chest, targeting the lats." },
  { name: "Chest Fly", description: "A chest isolation movement performed with dumbbells or cables." },
  { name: "Hammer Curl", description: "A biceps exercise with a neutral grip, using dumbbells." },
  { name: "Skullcrusher", description: "A triceps extension performed lying down, lowering weight to the forehead." },
  { name: "Face Pull", description: "A rear delt and upper back exercise pulling a rope toward the face." },
  { name: "Farmer's Walk", description: "A grip and conditioning exercise walking while holding heavy weights." },
  { name: "Arnold Press", description: "A shoulder press variation rotating dumbbells during the lift." },
  { name: "Incline Bench Press", description: "A chest press on an inclined bench, targeting upper chest." },
  { name: "Decline Push-up", description: "A push-up variation with feet elevated, emphasizing upper chest." }
]

exercises.each do |attrs|
  Exercise.find_or_create_by!(name: attrs[:name]) do |e|
    e.description = attrs[:description]
  end
end
