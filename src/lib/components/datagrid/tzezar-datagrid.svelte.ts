import { applyOffset } from "./fns/apply-offset"; // Utility function to apply offsets for column alignment
import { filterData } from "./fns/filter-data"; // Function to filter data based on active filters
import { paginateData } from "./fns/paginate-data"; // Function to handle pagination of the data set
import { sortData } from "./fns/sort-data"; // Function to sort the data based on specified criteria
import type { BaseColumn, ExpandedRows, Filter, FontSize, Pagination, SelectionState, Sorting, SpacingConfig } from "./types"; // Importing relevant types for TypeScript type checking
import { SvelteSet } from "svelte/reactivity"; // Svelte's reactive set implementation


// Recursive Partial type
type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

// Helper function to perform a deep merge of objects
function deepMerge<T extends object>(target: T, source: DeepPartial<T>): T {
  const output = { ...target };
  for (const key in source) {
    if (source.hasOwnProperty(key)) {
      if (source[key] instanceof Object && !Array.isArray(source[key])) {
        output[key] = deepMerge(output[key] as any, source[key] as any);
      } else {
        output[key] = source[key] as any;
      }
    }
  }
  return output;
}

/**
 * TzezarDatagrid is a generic class representing a configurable data grid component.
 * It supports various features including sorting, filtering, pagination, and selection of data rows.
 * 
 * @template T - The type of data items that will populate the grid.
 * @template C - The type of column configuration extending from BaseColumn.
 */
export class TzezarDatagrid<T, C extends BaseColumn<T> = BaseColumn<T>> {
  // Public properties
  mode = $state('client'); // Default mode set to client-side; allows for flexibility in data handling
  columns = $state<C[]>([]); // Stores the configuration for the grid columns
  data = $state<T[]>([]); // Holds the actual data items displayed in the grid
  title = $state(''); // Allows for a user-defined title for the data grid
  identifier = $state('1'); // Unique identifier for this grid instance, useful for state management

  // Lifecycle hooks for event handling
  onPageChange = () => { }; // Callback triggered on page changes, allows for custom logic to be applied
  onPerPageChange = () => { }; // Callback triggered when the number of items per page is modified
  onSortingChange = () => { }; // Callback for when sorting criteria are altered
  onFiltersChange = () => { }; // Callback for when filters are updated
  onChange = () => { }; // General callback for any state changes

  // State management
  state = $state({
    pagination: { page: 1, perPage: 20, count: 1 } as Pagination, // Initializes pagination settings, enabling straightforward data navigation
    status: { isFetching: false, isError: false, isRefetching: false }, // Tracks data fetching status for user feedback
    processedData: [] as T[],
    sortingArray: [] as Sorting[], // Stores current sorting criteria for easy reference
    filters: [] as Filter[], // Holds active filters to apply to the data
    expandedRows: [] as ExpandedRows, // Manages which rows are expanded for better user experience
    selectedRows: [] as T[], // Keeps track of user-selected rows for operations
    isFullscreenActive: false, // State for tracking fullscreen mode status
    isHeadFilterVisible: false, // State for managing visibility of header filters
  });

  // Internal state management
  internal = $state({
    selectionState: {
      start: null, // Starting index for selection, allowing for range selection
      end: null, // Ending index for selection
      range: new SvelteSet(), // Set to manage unique selections
      activeRange: new SvelteSet(), // Set for the currently active selection range
      isSelecting: false, // Indicates if the user is in the process of selecting
      isRemoving: false, // Indicates if selection is being removed
      isMouseDown: false // Tracks mouse state during selection actions
    } as SelectionState,
    keyboardNavigation: { focusedRowIndex: 0, focusedColumnIndex: 0 }, // Supports keyboard navigation, enhancing accessibility
    selectedRowIds: new SvelteSet<number>(), // Stores IDs of selected rows for quick reference
    headSize: -1, // Allows for header size adjustments as necessary
  });

  // Configuration options for additional features
  options = $state(this.getDefaultOptions());

  /**
   * Constructs a new TzezarDatagrid instance and initializes it with the provided configuration.
   * 
   * @param config - Configuration object for initializing the datagrid.
   */
  constructor(config: TzezarDatagridConfig<T, C>) {
    this.initializeFromConfig(config); // Initialize core properties and event handlers
    this.initializeData(); // Process the initial data set for display
  }

  private getDefaultOptions() {
    return {
      defaultColumnWidth: '200px',
      paginate: true,
      sortable: true,
      scrollable: true,
      fullscreenMode: { enabled: true },
      pagination: { display: true },
      dataIndicator: { display: true },
      statusIndicator: { display: true },
      rows: { striped: true },
      exportFileName: 'data',
      topbar: {
        display: false,
        displayFullscreenToggle: false,
        displayExportDataMenu: false,
        displayCopyDataMenu: false,
        displayHeadFilterToggle: false,
        settingsMenu: {
          display: false,
          displaySortingMenu: true,
          displayReorderingMenu: true,
          displayFreezingMenu: true,
          displayResizingMenu: true,
          displayVisibilityMenu: true,
          adjustmentMenu: {
            display: true,
            displaySpacingMenu: true,
            displayTextSizeMenu: true
          }
        }
      },
      footer: { display: false },
      spacing: {
        options: {
          none: { vertical: '0px', horizontal: '0px' },
          xs: { vertical: '3px', horizontal: '3px' },
          sm: { vertical: '5px', horizontal: '5px' },
          md: { vertical: '10px', horizontal: '10px' },
          lg: { vertical: '20px', horizontal: '20px' },
          xl: { vertical: '30px', horizontal: '30px' },
        },
        selected: { label: 'md', vertical: '10px', horizontal: '10px' }
      } as SpacingConfig,
      fontSize: {
        options: {
          xs: '0.75rem', sm: '0.875rem', md: '1rem', lg: '1.25rem', xl: '1.5rem',
        },
        selected: { label: 'md', value: '1rem' }
      } as FontSize
    };
  }

  // Initialize the datagrid with the provided configuration
  private initializeFromConfig(config: TzezarDatagridConfig<T, C>) {
    const { mode, columns, data, identifier, title, options, state, onPageChange, onPerPageChange, onSortingChange, onFiltersChange, onChange } = config;

    // Set core properties, ensuring defaults are respected
    this.mode = mode || this.mode; // Fallback to default mode if not provided
    // Apply offsets to columns for proper alignment
    // @ts-expect-error ts(2322) 
    this.columns = applyOffset(columns); // Ensure columns are properly aligned before display
    this.data = data; // Set the data for the grid
    this.identifier = identifier || this.identifier; // Use provided identifier or fallback to default
    this.title = title || this.title; // Set the title of the grid

    // Set event handlers, allowing for extensibility
    this.onPageChange = onPageChange || this.onPageChange;
    this.onPerPageChange = onPerPageChange || this.onPerPageChange;
    this.onSortingChange = onSortingChange || this.onSortingChange;
    this.onFiltersChange = onFiltersChange || this.onFiltersChange;
    this.onChange = onChange || this.onChange;

    // Initialize state from the provided configuration
    this.initializeState(state);

    // Initialize additional options as specified
    if (options) {
      this.updateOptions(options);
    }
  }
  updateOptions(newOptions: DeepPartial<ReturnType<TzezarDatagrid<T, C>['getDefaultOptions']>>) {
    this.options = deepMerge(this.options, newOptions);
    this.onChange();
  }
  // Initialize state with provided values or defaults
  private initializeState(state?: Partial<typeof this.state>) {
    if (state) {
      Object.assign(this.state, state); // Merge provided state values with existing state
    }
  }

  // Initialize options with provided values or defaults
  private initializeOptions(options?: Partial<typeof this.options>) {
    if (options) {
      Object.assign(this.options, options); // Merge provided options with existing configuration
    }
  }

  // Initialize data by sorting, filtering, and paginating it as per current state
  private initializeData() {
    this.updateProcessedData()
  }

  updateProcessedData() {
    if (this.mode === 'client') {
      const filteredData = filterData([...this.data], this.state.filters);
      this.updateCount(filteredData)
      this.state.processedData = paginateData(sortData(filteredData, this.state.sortingArray), this.state.pagination.page, this.state.pagination.perPage);
    }
  }

  updateCount(filteredData: T[]) {
    if (this.mode === 'client') {
      this.state.pagination.count = filteredData.length || 1;
    }
  }

  // Public methods for external interaction
  updateData(newData: T[]) {
    this.data = newData; // Update the data displayed in the grid
    this.initializeData(); // Re-initialize data processing after updating
    this.onChange(); // Trigger any change handlers to notify observers
  }

  updateColumns(newColumns: C[]) {
    //@ts-expect-error ts(2322)
    this.columns = applyOffset(newColumns); // Update columns with offsets applied.
  }

  updatePagination(page: number, perPage: number) {
    // Update pagination state and trigger callbacks
    this.state.pagination.page = page;
    this.state.pagination.perPage = perPage;
    this.updateProcessedData()

    this.onPageChange();
    this.onPerPageChange();
    this.onChange();
  }



  updateSorting(newSorting: Sorting[]) {
    // Update sorting state and trigger callbacks
    this.state.sortingArray = newSorting;
    this.updateProcessedData()

    this.onSortingChange();
    this.onChange();
  }

  updateFilters(newFilters: Filter[]) {
    this.state.filters = newFilters;
    this.state.pagination.page = 1;
    this.updateProcessedData()

    this.onFiltersChange();
    this.onChange();
  }

  toggleFullscreen() {
    this.state.isFullscreenActive = !this.state.isFullscreenActive;
  }

  toggleHeadFilter() {
    this.state.isHeadFilterVisible = !this.state.isHeadFilterVisible;
  }
}

// Configuration type for the TzezarDatagrid constructor
type TzezarDatagridConfig<T, C extends BaseColumn<T>> = {
  mode?: 'client' | 'server';
  columns: C[];
  data: T[];
  identifier?: string;
  title?: string;
  options?: DeepPartial<ReturnType<TzezarDatagrid<T, C>['getDefaultOptions']>>;
  state?: Partial<TzezarDatagrid<T, C>['state']>;
  onPageChange?: () => void;
  onPerPageChange?: () => void;
  onSortingChange?: () => void;
  onFiltersChange?: () => void;
  onChange?: () => void;
};

export type TopBarOptions = DeepPartial<ReturnType<TzezarDatagrid<unknown>['getDefaultOptions']>>['topbar']