class CreateDays < ActiveRecord::Migration[8.0]
  def change
    create_table :days do |t|
      t.references :routine, null: false, foreign_key: true
      t.integer :position

      t.timestamps
    end
  end
end
