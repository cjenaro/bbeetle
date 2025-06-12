class Block < ApplicationRecord
  belongs_to :day
  has_many :weeks, dependent: :destroy
  
  accepts_nested_attributes_for :weeks, allow_destroy: true, reject_if: :all_blank
end
