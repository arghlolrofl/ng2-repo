import PagedResultsOf from './paged-results';
import SortingInfo from './sorting-info';

export default class SortedPagedResultsOf<T> extends PagedResultsOf<T> {
    SortingInformation: SortingInfo;
}