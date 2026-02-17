"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
function filesystemRoutes(fs) {
    const router = (0, express_1.Router)();
    // Get file or directory info
    router.get('/info', (req, res) => {
        try {
            const { path } = req.query;
            if (!path || typeof path !== 'string') {
                return res.status(400).json({ error: 'Path parameter required' });
            }
            const file = fs.getFile(path);
            if (!file) {
                return res.status(404).json({ error: 'File not found' });
            }
            res.json(file);
        }
        catch (error) {
            res.status(500).json({ error: (error instanceof Error ? error.message : String(error)) });
        }
    });
    // List directory
    router.get('/list', (req, res) => {
        try {
            const { path } = req.query;
            if (!path || typeof path !== 'string') {
                return res.status(400).json({ error: 'Path parameter required' });
            }
            const files = fs.listDirectory(path);
            res.json({ path, files });
        }
        catch (error) {
            res.status(500).json({ error: (error instanceof Error ? error.message : String(error)) });
        }
    });
    // Create file
    router.post('/file', (req, res) => {
        try {
            const { path, content } = req.body;
            if (!path) {
                return res.status(400).json({ error: 'Path required' });
            }
            const file = fs.createFile(path, content || '');
            res.status(201).json(file);
        }
        catch (error) {
            res.status(500).json({ error: (error instanceof Error ? error.message : String(error)) });
        }
    });
    // Write/Update file content
    router.post('/write', (req, res) => {
        try {
            const { path, content } = req.body;
            if (!path) {
                return res.status(400).json({ error: 'Path required' });
            }
            const file = fs.writeFile(path, content || '');
            if (file) {
                res.json(file);
            }
            else {
                res.status(500).json({ error: 'Failed to write file' });
            }
        }
        catch (error) {
            res.status(500).json({ error: (error instanceof Error ? error.message : String(error)) });
        }
    });
    // Create directory
    router.post('/directory', (req, res) => {
        try {
            const { path } = req.body;
            if (!path) {
                return res.status(400).json({ error: 'Path required' });
            }
            const dir = fs.createDirectory(path);
            res.status(201).json(dir);
        }
        catch (error) {
            res.status(500).json({ error: (error instanceof Error ? error.message : String(error)) });
        }
    });
    // Delete file/directory
    router.delete('/', (req, res) => {
        try {
            const { path, recursive } = req.body;
            if (!path) {
                return res.status(400).json({ error: 'Path required' });
            }
            const file = fs.getFile(path);
            if (!file) {
                return res.status(404).json({ error: 'File not found' });
            }
            if (file.type === 'directory') {
                fs.deleteDirectory(path, recursive || false);
            }
            else {
                fs.deleteFile(path);
            }
            res.json({ success: true });
        }
        catch (error) {
            res.status(500).json({ error: (error instanceof Error ? error.message : String(error)) });
        }
    });
    // Rename file/directory
    router.post('/rename', (req, res) => {
        try {
            const { path, newName } = req.body;
            if (!path || !newName) {
                return res.status(400).json({ error: 'Path and newName required' });
            }
            const file = fs.getFile(path);
            if (!file) {
                return res.status(404).json({ error: 'File not found' });
            }
            const parts = path.split('\\');
            parts.pop();
            const newPath = parts.join('\\') + '\\' + newName;
            const success = fs.moveFile(path, newPath);
            if (success) {
                res.json({ success: true, newPath });
            }
            else {
                res.status(500).json({ error: 'Failed to rename' });
            }
        }
        catch (error) {
            res.status(500).json({ error: (error instanceof Error ? error.message : String(error)) });
        }
    });
    // Move file/directory
    router.post('/move', (req, res) => {
        try {
            const { sourcePath, destPath } = req.body;
            if (!sourcePath || !destPath) {
                return res.status(400).json({ error: 'sourcePath and destPath required' });
            }
            const source = fs.getFile(sourcePath);
            if (!source) {
                return res.status(404).json({ error: 'Source file not found' });
            }
            const success = fs.moveFile(sourcePath, destPath + '\\' + source.name);
            if (success) {
                res.json({ success: true });
            }
            else {
                res.status(500).json({ error: 'Failed to move' });
            }
        }
        catch (error) {
            res.status(500).json({ error: (error instanceof Error ? error.message : String(error)) });
        }
    });
    // Copy file/directory
    router.post('/copy', (req, res) => {
        try {
            const { sourcePath, destPath } = req.body;
            if (!sourcePath || !destPath) {
                return res.status(400).json({ error: 'sourcePath and destPath required' });
            }
            const source = fs.getFile(sourcePath);
            if (!source) {
                return res.status(404).json({ error: 'Source file not found' });
            }
            const success = fs.copyFile(sourcePath, destPath + '\\' + source.name);
            if (success) {
                res.json({ success: true });
            }
            else {
                res.status(500).json({ error: 'Failed to copy' });
            }
        }
        catch (error) {
            res.status(500).json({ error: (error instanceof Error ? error.message : String(error)) });
        }
    });
    // ============ Recycle Bin Routes ============
    // Get all items in recycle bin
    router.get('/recycle-bin', (req, res) => {
        try {
            const items = fs.getRecycleBinItems();
            res.json({ items });
        }
        catch (error) {
            res.status(500).json({ error: (error instanceof Error ? error.message : String(error)) });
        }
    });
    // Get single recycle bin item
    router.get('/recycle-bin/:id', (req, res) => {
        try {
            const { id } = req.params;
            const item = fs.getRecycleBinItem(id);
            if (!item) {
                return res.status(404).json({ error: 'Item not found in recycle bin' });
            }
            res.json(item);
        }
        catch (error) {
            res.status(500).json({ error: (error instanceof Error ? error.message : String(error)) });
        }
    });
    // Send file/directory to recycle bin
    router.post('/recycle', (req, res) => {
        try {
            const { path, recursive } = req.body;
            if (!path) {
                return res.status(400).json({ error: 'Path required' });
            }
            const file = fs.getFile(path);
            if (!file) {
                return res.status(404).json({ error: 'File not found' });
            }
            let entries;
            if (file.type === 'directory') {
                entries = fs.recycleDirectory(path, recursive || false);
            }
            else {
                const entry = fs.recycleFile(path);
                entries = entry ? [entry] : [];
            }
            res.json({ success: true, entries });
        }
        catch (error) {
            res.status(500).json({ error: (error instanceof Error ? error.message : String(error)) });
        }
    });
    // Restore item from recycle bin
    router.post('/recycle/restore/:id', (req, res) => {
        try {
            const { id } = req.params;
            const success = fs.restoreFromRecycleBin(id);
            if (!success) {
                return res.status(404).json({ error: 'Item not found in recycle bin' });
            }
            res.json({ success: true });
        }
        catch (error) {
            res.status(400).json({ error: (error instanceof Error ? error.message : String(error)) });
        }
    });
    // Permanently delete item from recycle bin
    router.delete('/recycle/:id', (req, res) => {
        try {
            const { id } = req.params;
            const success = fs.deleteFromRecycleBin(id);
            if (!success) {
                return res.status(404).json({ error: 'Item not found in recycle bin' });
            }
            res.json({ success: true });
        }
        catch (error) {
            res.status(500).json({ error: (error instanceof Error ? error.message : String(error)) });
        }
    });
    // Empty recycle bin
    router.post('/recycle/empty', (req, res) => {
        try {
            const count = fs.emptyRecycleBin();
            res.json({ success: true, count });
        }
        catch (error) {
            res.status(500).json({ error: (error instanceof Error ? error.message : String(error)) });
        }
    });
    return router;
}
exports.default = filesystemRoutes;
//# sourceMappingURL=filesystem.js.map