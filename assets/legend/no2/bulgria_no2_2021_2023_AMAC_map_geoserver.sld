<?xml version="1.0" encoding="UTF-8"?>
<StyledLayerDescriptor xmlns="http://www.opengis.net/sld" version="1.0.0">
  <NamedLayer>
    <Name>bulgria_no2_2021_2023_AMAC_map</Name>
    <UserStyle>
      <Name>bulgria_no2_2021_2023_AMAC_map_geoserver</Name>
      <Title>Bulgaria NO2 2021-2023 AMAC map</Title>
      <FeatureTypeStyle>
        <Rule>
          <RasterSymbolizer>
            <ChannelSelection>
              <GrayChannel>
                <SourceChannelName>1</SourceChannelName>
              </GrayChannel>
            </ChannelSelection>
            <ColorMap type="intervals">
              <ColorMapEntry color="#3462cf" quantity="-5" label="&lt;= -5,0000"/>
              <ColorMapEntry color="#8b97cc" quantity="-2" label="-5,0000 - -2,0000"/>
              <ColorMapEntry color="#dadbc5" quantity="0" label="-2,0000 - 0,0000"/>
              <ColorMapEntry color="#f7d59e" quantity="2" label="0,0000 - 2,0000"/>
              <ColorMapEntry color="#e08865" quantity="5" label="2,0000 - 5,0000"/>
              <ColorMapEntry color="#c44539" quantity="1.0E308" label="&gt; 5,0000"/>
            </ColorMap>
          </RasterSymbolizer>
        </Rule>
      </FeatureTypeStyle>
    </UserStyle>
  </NamedLayer>
</StyledLayerDescriptor>
