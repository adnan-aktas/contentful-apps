import { ChangeEvent, useMemo } from 'react';
import { Box, FormControl, Select, TextInput, Flex, IconButton } from '@contentful/f36-components';
import { CloseIcon } from '@contentful/f36-icons';
import { debounce } from 'lodash';
import tokens from '@contentful/f36-tokens';
import { ContentType } from '@contentful/app-sdk';

import {
  ApplyContentTypePreviewPathSelectionPayload,
  ContentTypePreviewPathSelection,
} from '@customTypes/configPage';
import { styles } from './ContentTypePreviewPathSelectionRow.styles';

interface Props {
  contentTypes: ContentType[];
  configuredContentTypePreviewPathSelection?: ContentTypePreviewPathSelection;
  onParameterUpdate: (parameters: ApplyContentTypePreviewPathSelectionPayload) => void;
  onRemoveRow: (parameters: ContentTypePreviewPathSelection) => void;
  renderLabel?: boolean;
}

export const ContentTypePreviewPathSelectionRow = ({
  contentTypes,
  configuredContentTypePreviewPathSelection = { contentType: '', previewPath: '' },
  onParameterUpdate,
  onRemoveRow,
  renderLabel,
}: Props) => {
  const { contentType: configuredContentType, previewPath: configuredPreviewPath } =
    configuredContentTypePreviewPathSelection;

  const handlePreviewPathInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    onParameterUpdate({
      oldContentType: configuredContentType,
      newContentType: configuredContentType,
      newPreviewPath: event.target.value,
    });
  };

  const handleContentTypeChange = (event: ChangeEvent<HTMLSelectElement>) => {
    onParameterUpdate({
      oldContentType: configuredContentType,
      newContentType: event.target.value,
      newPreviewPath: configuredPreviewPath,
    });
  };

  const handleRemoveRow = () => {
    onRemoveRow(configuredContentTypePreviewPathSelection);
  };

  const debouncedHandlePreviewPathInputChange = useMemo(
    () => debounce(handlePreviewPathInput, 700),
    []
  );

  return (
    <Box className={styles.wrapper}>
      <FormControl id="contentTypeSelect">
        {renderLabel && (
          <FormControl.Label isRequired>Content type and preview path</FormControl.Label>
        )}
        <Flex flexDirection="row" justifyContent="space-evenly" gap={tokens.spacingXs}>
          <Select
            id="contentTypeSelect"
            name="contentTypeSelect"
            className={styles.select}
            defaultValue={configuredContentType}
            onChange={handleContentTypeChange}>
            {contentTypes && contentTypes.length ? (
              <>
                <Select.Option value="" isDisabled>
                  Select content type...
                </Select.Option>
                {contentTypes.map((contentType) => (
                  <Select.Option key={`option-${contentType.sys.id}`} value={contentType.sys.id}>
                    {contentType.name}
                  </Select.Option>
                ))}
              </>
            ) : (
              <Select.Option value="">No Content Types currently configured.</Select.Option>
            )}
          </Select>
          <TextInput
            defaultValue={configuredPreviewPath}
            isDisabled={!configuredContentType}
            onChange={debouncedHandlePreviewPathInputChange}
            placeholder="Set preview path and token"
          />
          <IconButton onClick={handleRemoveRow} icon={<CloseIcon />} aria-label={'Delete row'} />
        </Flex>
      </FormControl>
    </Box>
  );
};
