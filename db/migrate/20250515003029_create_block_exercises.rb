class CreateBlockExercises < ActiveRecord::Migration[8.0]
  def change
    create_table :block_exercises do |t|
      t.references :block, null: false, foreign_key: true
      t.references :exercise, null: false, foreign_key: true
      t.integer :sets
      t.integer :reps

      t.timestamps
    end
  end
end
