class Block < ApplicationRecord
  belongs_to :day
  has_many :block_exercises, dependent: :destroy
  accepts_nested_attributes_for :block_exercises
end
