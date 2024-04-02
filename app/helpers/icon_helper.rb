# frozen_string_literal: true

module IconHelper
  def icon_url
    full_asset_url(instance_presenter.icon&.file&.url || asset_pack_path('media/images/logo.png'))
  end

  def instance_presenter
    @instance_presenter ||= InstancePresenter.new
  end
end
