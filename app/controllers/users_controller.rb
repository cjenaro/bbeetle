class UsersController < ApplicationController
  allow_unauthenticated_access only: %i[ new create ]
  rate_limit to: 10, within: 3.minutes, only: :create, with: -> { redirect_to new_session_url, alert: "Try again later." }

  def new
    render inertia: 'users/new'
  end

  def create
    user = User.new(params.permit(:email_address, :password, :password_confirmation))
    if user.save
      start_new_session_for user
      redirect_to after_authentication_url
    else
      redirect_to new_user_path, inertia: { errors: user.errors.full_messages }
    end
  end
end
