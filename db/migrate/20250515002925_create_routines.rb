class CreateRoutines < ActiveRecord::Migration[8.0]
  def change
    create_table :routines do |t|
      t.string :title
      t.text :description
      t.boolean :is_active

      t.timestamps
    end
  end
end
