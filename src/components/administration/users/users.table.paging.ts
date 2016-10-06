import {Component, Input, Output, EventEmitter} from '@angular/core';
import {TranslatePipe} from 'ng2-translate/ng2-translate';

@Component({
    selector: 'fp-administration-users-table-paging',
    templateUrl: 'assets/templates/administration/users/users.table.paging.html',
    styles: [
        '.paging-control { background-color: #eee; padding-top: 5px; padding-bottom: 0; }',
        '.paging-status { width: 100%; text-align: center; }',
        '.icon-button { background-color: #eee; }'
    ]
})

export default class UsersTablePagingComponent {
    //#region Input

    @Input() resultCount: number;
    @Input() totalResultCount: number;
    @Input() currentPage: number;

    //#endregion

    //#region Output

    @Output() changePageRequested: EventEmitter<number> = new EventEmitter<number>();
    @Output() resultCountChanged: EventEmitter<number> = new EventEmitter<number>();
    @Output() pageChanged: EventEmitter<number> = new EventEmitter<number>();

    //#endregion

    //#region Properties

    public get ResultCount(): number {
        return +this.resultCount;
    }
    public set ResultCount(val: number) {
        this.resultCount = val;
        this.resultCountChanged.emit(this.resultCount);
    }

    public get TotalResultCount(): number { return this.totalResultCount; }
    public set TotalResultCount(val: number) {
        this.totalResultCount = val;
    }


    public get DisplayedResultCount(): number {
        if (this.resultCount > this.totalResultCount)
            return this.totalResultCount;

        return this.resultCount;
    }

    public get CurrentPage(): number { return this.currentPage; }
    public set CurrentPage(val: number) {
        this.currentPage = val;
        console.info("Current Page set to: " + val);

        this.pageChanged.emit(val);
    }
    public get MaxPage(): number {
        if (this.ResultCount > this.totalResultCount)
            return 1;

        let rest: number = this.TotalResultCount % this.ResultCount;

        let max: number = (this.TotalResultCount - rest) / this.ResultCount;

        if (rest > 0)
            max++;

        return max;
    }

    //#endregion

    /**
     * Emits an request to switch to the next page
     */
    private goToNextPage() {
        if (this.CurrentPage >= this.MaxPage)
            return;

        let pageIndex: number = this.CurrentPage;
        this.CurrentPage = this.CurrentPage + 1;

        let newStartIndex: number = pageIndex * this.ResultCount + 1;

        console.info("PAGE: " + this.CurrentPage);

        this.changePageRequested.emit(newStartIndex - 1);
    }

    /**
     * Emits an request to switch to the previous page
     */
    private goToPreviousPage() {
        if (this.CurrentPage <= 1)
            return;

        this.CurrentPage = this.CurrentPage - 1;

        let newStartIndex: number = (this.CurrentPage - 1) * this.ResultCount + 1;

        console.info("PAGE: " + this.CurrentPage);

        this.changePageRequested.emit(newStartIndex - 1);
    }
}