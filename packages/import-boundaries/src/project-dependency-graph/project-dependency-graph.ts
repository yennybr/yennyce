import { ImportResolutions } from '../api/import-resolver.interface';

export class ProjectDependencyGraph {
    public static createProjectDependencyGraph(
        allProjectNames: string[],
        absoluteFilePathToProjectsMap: Record<string, string[] | undefined>,
        fileToResolvedImportsMap: Record<string, ImportResolutions[]>
    ): Record<string, string[]> {
        const projectDependencyGraph: Record<string, string[]> = {};
        const allFilePaths: string[] = Object.keys(absoluteFilePathToProjectsMap);
        allFilePaths.forEach((filePath: string): void => {
            const projectsOfFile: string[] = absoluteFilePathToProjectsMap[filePath] ?? [];
            const resolvedImportsOfFile: ImportResolutions[] = fileToResolvedImportsMap[filePath] ?? [];
            const importedProjectsOfFile: string[] = ProjectDependencyGraph.getImportedProjectsOfFile(
                absoluteFilePathToProjectsMap,
                resolvedImportsOfFile
            );
            ProjectDependencyGraph.extendDependencyGraph(projectDependencyGraph, projectsOfFile, importedProjectsOfFile);
        });
        allProjectNames.forEach((projectName: string) => {
            if (!projectDependencyGraph[projectName]) {
                projectDependencyGraph[projectName] = [];
            }
        });
        return projectDependencyGraph;
    }

    public static getImportedProjectsOfFile(
        absoluteFilePathToProjectsMap: Record<string, string[] | undefined>,
        importResolutions: ImportResolutions[]
    ): string[] {
        const projectsMatchingGivenImport: string[] = [];
        importResolutions.forEach((importResolution: ImportResolutions): void => {
            importResolution.resolvedImports.forEach((resolvedImport: ImportResolutions['resolvedImports'][number]): void => {
                absoluteFilePathToProjectsMap[resolvedImport.resolvedAbsoluteFilePath]?.forEach((matchingProject: string): void => {
                    if (!projectsMatchingGivenImport.includes(matchingProject)) {
                        projectsMatchingGivenImport.push(matchingProject);
                    }
                });
            });
        });
        return projectsMatchingGivenImport;
    }

    /**
     * Impure method, will modify projectDependencyGraph in place.
     * Note: A project does not depend on itself; we do not model this in the
     * dependency-graph.
     * @param projectDependencyGraph
     * @param dependents only unique values
     * @param dependencies only unique values
     */
    private static extendDependencyGraph(
        projectDependencyGraph: Record<string, string[]>,
        dependents: string[],
        dependencies: string[]
    ): void {
        dependents.forEach((dependent: string): void => {
            if (!projectDependencyGraph[dependent]) {
                projectDependencyGraph[dependent] = [];
            }
            dependencies.forEach((dependency: string): void => {
                const existingDependencies: string[] | undefined = projectDependencyGraph[dependent];
                if (existingDependencies && !existingDependencies.includes(dependency) && dependency !== dependent) {
                    existingDependencies.push(dependency);
                }
            });
        });
    }
}
