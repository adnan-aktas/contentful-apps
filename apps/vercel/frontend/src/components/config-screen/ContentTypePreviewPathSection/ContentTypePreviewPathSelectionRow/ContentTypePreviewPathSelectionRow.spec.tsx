import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { ContentTypePreviewPathSelectionRow } from './ContentTypePreviewPathSelectionRow';
import { mockContentTypes } from '@test/mocks/mockContentTypes';

vi.mock('lodash', () => ({
  debounce: (fn: { cancel: () => void }) => {
    fn.cancel = vi.fn();
    return fn;
  },
}));

describe('ContentTypePreviewPathSelectionRow', () => {
  it('calls handler to update parameters when each input is provided', () => {
    const mockOnUpdate = vi.fn();
    const { unmount } = render(
      <ContentTypePreviewPathSelectionRow
        contentTypes={mockContentTypes}
        onParameterUpdate={mockOnUpdate}
        onRemoveRow={() => null}
      />
    );

    const select = document.querySelector('select');
    fireEvent.change(select!, { target: { value: mockContentTypes[0].sys.id } });

    expect(mockOnUpdate).toHaveBeenCalled();

    const previewPathInput = screen.getByPlaceholderText('Set preview path and token');
    fireEvent.change(previewPathInput, { target: { value: 'test-path' } });

    expect(mockOnUpdate).toHaveBeenCalled();
    unmount();
  });

  it('calls handler to remove row when remove button is clicked', () => {
    const selection = { contentType: 'blog', previewPath: 'test-blog-path-1' };
    const mockOnRemoveRow = vi.fn();
    const { unmount } = render(
      <ContentTypePreviewPathSelectionRow
        contentTypes={mockContentTypes}
        onParameterUpdate={() => null}
        onRemoveRow={mockOnRemoveRow}
        configuredContentTypePreviewPathSelection={selection}
      />
    );

    const removeButton = screen.getAllByRole('button', { name: 'Delete row' });
    removeButton[0].click();

    expect(mockOnRemoveRow).toHaveBeenCalledOnce();
    unmount();
  });

  it('renders selection row without configured selections provided', () => {
    const { unmount } = render(
      <ContentTypePreviewPathSelectionRow
        contentTypes={mockContentTypes}
        onParameterUpdate={() => null}
        onRemoveRow={() => null}
      />
    );

    expect(screen.getByText('Select content type...')).toBeTruthy();
    expect(screen.getByPlaceholderText('Set preview path and token')).toBeTruthy();
    unmount();
  });

  it('renders selection row with configured selection provided', () => {
    const selection = { contentType: 'blog', previewPath: 'test-blog-path-2' };
    const { unmount } = render(
      <ContentTypePreviewPathSelectionRow
        contentTypes={mockContentTypes}
        onParameterUpdate={() => null}
        onRemoveRow={() => null}
        configuredContentTypePreviewPathSelection={selection}
      />
    );

    expect(screen.getByDisplayValue(selection.previewPath)).toBeTruthy();
    unmount();
  });

  it('renders message when no content types exist', () => {
    const selection = { contentType: 'blog', previewPath: 'test-blog-path-3' };
    const { unmount } = render(
      <ContentTypePreviewPathSelectionRow
        contentTypes={[]}
        onParameterUpdate={() => null}
        onRemoveRow={() => null}
        configuredContentTypePreviewPathSelection={selection}
      />
    );

    expect(screen.getByText('No Content Types currently configured.')).toBeTruthy();
    unmount();
  });
});
