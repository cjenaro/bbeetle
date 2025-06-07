class Block < ApplicationRecord
  belongs_to :day
  has_many :block_exercises, dependent: :destroy
  has_many :weeks, dependent: :destroy
  
  accepts_nested_attributes_for :block_exercises
  accepts_nested_attributes_for :weeks, allow_destroy: true
end
