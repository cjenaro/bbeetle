# frozen_string_literal: true

class InertiaExampleController < ApplicationController

  inertia_share do {
    user: {
      email_address: Current.user.email_address,
      id: Current.user.id
    }
  } 
  end

  def index
    render inertia: 'InertiaExample', props: {
      name: params.fetch(:name, 'World'),
    }
  end
end
