import { Phase3Result } from '../phase-3-project-changes/phase-3.result.type';
import { AbstractPhase4Executor } from './phase-4.executor';
import { log } from '../util/log';

export class Phase4OutputOnlyExecutor extends AbstractPhase4Executor {
    constructor(phase3Result: Phase3Result) {
        super(phase3Result);
    }

    public static execute(phase3Result: Phase3Result): void {
        new Phase4OutputOnlyExecutor(phase3Result).outputAffectedAndExitIfOutputOnlyMode();
    }

    public outputAffectedAndExitIfOutputOnlyMode(): void {
        const affectedProjects = this.phase3Result.affectedProjects;
        affectedProjects.forEach((projectName: string) => log(projectName));
        this.exitYanice(0, null);
    }
}
