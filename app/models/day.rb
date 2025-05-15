class Day < ApplicationRecord
  belongs_to :routine
  has_many :blocks, dependent: :destroy
  accepts_nested_attributes_for :blocks
end
